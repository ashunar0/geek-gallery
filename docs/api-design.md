# API設計: GeekSalon 受講生作品集サイト

## 技術スタック

- Next.js App Router (Vercel)
- Auth.js (NextAuth v5) + Google OAuth（認証）
- Neon PostgreSQL（データベース）
- Cloudflare R2（画像ストレージ、S3互換）

## 認証（Auth.js が提供）

Auth.js (NextAuth v5) が自動的にエンドポイントを生成する。

```
GET/POST /api/auth/signin         → サインインページ
GET/POST /api/auth/signout        → サインアウト
GET      /api/auth/session        → セッション取得
GET      /api/auth/callback/google → Googleコールバック
```

### 登録フロー

1. `/register` ページにアクセス（URLは受講生にのみ共有）
2. 「Googleでログイン」ボタン → Auth.js の Google OAuth
3. 初回ログイン時に users レコードが作成される
4. セッションCookie発行 → トップにリダイレクト

※ `/register` と `/login` は同じOAuthフローだが、UIとして分けておく。
  サイト上には `/login` のみリンクを掲載する。

## 作品 API

| メソッド | パス | 認証 | 説明 |
|---|---|---|---|
| POST | `/api/works` | 要 | 作品投稿 |
| PUT | `/api/works/[id]` | 要（本人のみ） | 作品編集 |
| DELETE | `/api/works/[id]` | 要（本人のみ） | 作品削除 |

### POST /api/works

リクエストボディ:

```json
{
  "title": "作品名",
  "url": "https://example.com",
  "imageKey": "works/xxx-xxx.png",
  "techStack": ["React", "Firebase"],
  "description": "説明文",
  "authorName": "制作者名",
  "duration": "2ヶ月",
  "course": "Web Expert",
  "cohort": 30,
  "highlight": "こだわりポイント"
}
```

### PUT /api/works/[id]

リクエストボディ: POST と同じ構造（部分更新可）

権限チェック: `works.user_id === session.user.id`

### DELETE /api/works/[id]

権限チェック: `works.user_id === session.user.id`

## 画像アップロード

Cloudflare R2 に S3互換API (AWS SDK) 経由でアップロード。

```
POST /api/upload  → R2に画像アップロード（要認証）
```

設定:
- 最大ファイルサイズ: 10MB
- 許可する形式: .jpg, .jpeg, .png, .gif, .webp

フロー:
1. 投稿フォームで画像を選択
2. `/api/upload` で R2 にアップロード → image key が返る
3. 作品投稿 `/api/works` に image key を含めて送信

## ページ（App Router）

| パス | 認証 | 説明 |
|---|---|---|
| `/` | 不要 | 作品一覧（コース別フィルタ: `?course=Web+Expert`） |
| `/works/[id]` | 不要 | 作品詳細 |
| `/works/new` | 要 | 投稿フォーム |
| `/works/[id]/edit` | 要（本人のみ） | 編集フォーム |
| `/login` | 不要 | ログイン画面 |
| `/register` | 不要 | 新規登録画面（リンク非公開） |
