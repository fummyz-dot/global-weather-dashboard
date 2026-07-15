# Global Weather Dashboard

東京、大阪、札幌、バルセロナ、パリ、ローマの天気を比較するモノレポです。
FastAPIバックエンドと、Reactによるレスポンシブなダッシュボードを実装しています。

## 構成

```text
.
├── frontend/        # React、TypeScript、Vite
└── backend/
    ├── app/         # FastAPIアプリケーション
    ├── tests/       # pytest
    └── requirements.txt
```

データベース、認証、APIキーは使用しません。気象データは
[Open-Meteo](https://open-meteo.com/) から取得します。

## ライセンス

このリポジトリのソースコードは [MIT License](LICENSE) で公開します。

気象データはOpen-Meteoにより [CC BY 4.0](https://open-meteo.com/en/license)
で提供されています。画面では数値を読みやすい形式へ整形し、当日の予想最高気温を
もとに独自の高温レベルを算出しています。この高温レベルはOpen-Meteoの提供項目や
公的な気象警報ではありません。

## API

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/health` | アプリケーションの死活確認 |
| GET | `/api/dashboard` | 6都市の現在値と当日予報を一括取得 |
| GET | `/api/cities/{slug}` | 1都市の現在値、24時間予報、7日間予報 |

`/api/dashboard` はOpen-Meteoの複数座標指定を使用し、6都市を1回の
外部HTTPリクエストで取得します。

高温レベルは当日の予想最高気温を使った独自指標です。

| Level | Temperature |
| --- | --- |
| `normal` | 30℃未満 |
| `hot` | 30℃以上35℃未満 |
| `veryHot` | 35℃以上40℃未満 |
| `extreme` | 40℃以上 |

この区分は公的な気象警報や熱中症警戒情報ではありません。

## 必要環境

- Python 3.11以上
- Windows 11 + WSL2 Ubuntu、または同等のLinux環境

## ローカル起動

WSL2のターミナルでリポジトリの `backend` ディレクトリへ移動して実行します。

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
uvicorn app.main:app --reload
```

起動後は `http://127.0.0.1:8000/docs` でOpenAPI UIを確認できます。

別のWSL2ターミナルでフロントエンドを起動します。

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

ブラウザで `http://localhost:5173` を開きます。

## 環境変数

`ALLOWED_ORIGINS` にCORSで許可するoriginをカンマ区切りで指定します。
未設定時は `http://localhost:5173` のみを許可します。

```bash
export ALLOWED_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

本番ではVercelに登録したフロントエンドのoriginを環境変数へ設定してください。

## テスト

```bash
cd backend
source .venv/bin/activate
pytest
python -c "from app.main import app; print(app.title)"
```

フロントエンド:

```bash
cd frontend
npm run lint
npm test
npm run build
```

テストでは `httpx.MockTransport` を使用し、Open-Meteoへの実通信は行いません。

## Vercel

同じGitHubリポジトリから別々のVercelプロジェクトを作り、バックエンドの
Root Directoryを `backend` に設定します。Vercelが認識できる
`app/main.py` から `app` という名前でFastAPIインスタンスを公開しています。

フロントエンドのRoot Directoryは `frontend` に設定し、Vercel環境変数
`VITE_API_BASE_URL` にバックエンドの公開URLを指定します。
