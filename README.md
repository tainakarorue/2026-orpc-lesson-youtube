This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Git ワークフロー

### PRマージ前に誤って次の作業を始めてしまった場合

1. **変更を一時退避**
   ```bash
   git stash
   ```

2. **GitHub で PR をマージ**（Confirm merge ボタンを押す）

3. **ローカルの main を最新化**
   ```bash
   git checkout main
   git pull
   ```

4. **新しいブランチを作成して変更を復元**
   ```bash
   git checkout -b 18-新しいブランチ名
   git stash pop
   ```

5. **作業完了後、コミット → プッシュ → PR作成**
   ```bash
   git add .
   git commit -m "コミットメッセージ"
   git push -u origin 18-新しいブランチ名
   ```
