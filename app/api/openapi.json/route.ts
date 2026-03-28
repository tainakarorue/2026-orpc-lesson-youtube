import { OpenAPIGenerator } from '@orpc/openapi'
import type {
  ConditionalSchemaConverter,
  SchemaConvertOptions,
} from '@orpc/openapi'
import { z } from 'zod'
import { router } from '@/orpc/routers'

// Zod v4 has native toJSONSchema() — use it as the schema converter
const zodV4Converter: ConditionalSchemaConverter = {
  condition(schema) {
    return schema instanceof z.ZodType
  },
  convert(schema, _options: SchemaConvertOptions) {
    const zodSchema = schema as z.ZodType
    const jsonSchema = zodSchema.toJSONSchema({
      unrepresentable: 'any',
    }) as Record<string, unknown>
    const required = !zodSchema.isOptional()
    return [required, jsonSchema]
  },
}

const generator = new OpenAPIGenerator({ schemaConverters: [zodV4Converter] })

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  const spec = await generator.generate(router, {
    info: {
      title: 'next-orpc API',
      version: '1.0.0',
      description: 'oRPC で構築された Next.js API',
    },
    servers: [
      { url: '/rpc', description: 'RPC エンドポイント（oRPC クライアント用）' },
      {
        url: '/api/rest',
        description: 'REST エンドポイント（汎用 HTTP クライアント用）',
      },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  })

  return Response.json(spec)
}
