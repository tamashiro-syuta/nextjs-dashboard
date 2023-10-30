# Next.js(App Router) の公式チュートリアル
- https://nextjs.org/learn/dashboard-app

以下、各章のメモ

## CSS Style
### Tailwind
- Tailwind用のスタイルを用意していて、それにするとglobal.cssに設定済みになる
  - `/app/layout.tsx` には自分でimportする必要あり

### CSS Modules
- CSS モジュールを 使用すると、一意のクラス名を自動的に作成することで CSS の範囲をコンポーネントに設定できるため、名前の衝突を心配する必要がなくなる
- サンプルでは`/app/ui/home.module.css`って命名していたから、`〇〇.modules.css`ってするのが一般的と思われる

### clsx
- `clsx`っていうライブラリを使うと、条件分岐しながらスタイルをかけるから複雑なスタイリングしやすくなるっぽい (他のCSSinJSとあんまり変わらない印象)
- 公式ではサンプルだから下の感じでやってたけど、実際使う時は`className`に直接書かずに、スタイルの条件をカプセル化した方が良いかも
  ```javascript
  className={clsx(
    'inline-flex items-center rounded-full px-2 py-1 text-sm',
    {
      'bg-gray-100 text-gray-500': status === 'pending',
      'bg-green-500 text-white': status === 'paid',
    },
  )}
  ```

## フォントと画像の最適化
### フォント
- **【 結論: `next/font` を使え 】**
- ブラウザでは最初にフォールバックフォント or システムフォントでテキストをレンダリング
- それが読み込まれるとカスタムフォントに置き換わるときに発生する
- この入れ替えによって、テキストのサイズ、間隔、レイアウトが変更され、周囲の要素が移動することがある
- next.jsは、next/fontモジュールを使用すると、アプリケーション内のフォントを自動的に最適化する
- これは、ビルド時にフォントファイルをダウンロードし、他の静的アセットと一緒にホスティングすることによって行われる
- つまり、ユーザーがアプリケーションにアクセスしたときに、パフォーマンスに影響するようなフォントの追加ネットワークリクエストが発生しない

### 画像
- **【 結論: `next/image` を使え 】**
- `next/image`は以下の機能を自動で行う
  - 画像読み込み時に自動的にレイアウトがずれるのを防ぐ
  - 小さなビューポートを備えたデバイスに大きな画像が送信されるのを避けるために、画像のサイズを変更する
  - デフォルトで画像を遅延読み込み (画像はビューポートに入るときに読み込まれる)
  - WebPやAVIなどの最新の形式で画像を提供(※ブラウザがサポートしている場合)
  - 画像のサイズをheightプロパティとwidthプロパティで指定するのはベストプラクティス
  - デバイスのサイズごとに画像のサイズ等を変更したい時は、`Image`コンポーネントを複数用意して、`tailwind`の`hidden`などで出し分けるのもあり

## layoutとpageの作成
- layoutは配下のコンポーネントへ遷移する際は再レンダリングされずに最適化される(`partial rendering`)

## ページ間のnavigate
- `a`タグを使うと、ページ全体が再レンダリングされる
- `Link`コンポーネントは、Client側のナビゲーションを担当
- `Link`コンポーネントは、変更部分のみレンダリング(layout.tsxなどは無駄にレンダリングされない)
- Next.jsはルートセグメントによってアプリケーションを自動的にコード分割している(ブラウザが最初のロード時にすべてのアプリケーションコードをロードする従来のSPAとの違い)
- ルートセグメントによってコードが分割 = ページが分離されており、特定のページがエラーをスローしてもアプリケーションの残りの部分は動作する
- 本番環境では、`<Link>`コンポーネントがブラウザのビューポートに表示されるたびに、Next.jsはバックグラウンドでリンクされたルートのコードを自動的にプリフェッチする
- ユーザーがリンクをクリックするころには、リンク先ページのコードはすでにバックグラウンドで読み込まれており、ページ遷移が早くなる

## データの取得
- Next.jsでデータをfetchする方法は主に以下
  - API層
    - **API を提供するサードパーティサービスを使用している場合**(SupabaseやFirebaseなど)
    - クライアントからデータを取得する場合は、データベースの秘密がクライアントに公開されるのを避けるために、サーバー上で実行される API層が必要
    - Next.jsでは[Router Hadlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)を使用して、APIエンドポイントを作成できる
  - データベースクエリ
    - **フルスタックアプリケーションを作成する場合**
    - その中でも、以下の2種類がある
      - PrismaなどのORMを使ってAPIエンドポイントからDBと対話する
      - React Server Components(RSC) を使用する(API層を介さずにセキュアにDBに直接クエリを実行できる)
- デフォルトではNext.jsはReact Server Componentsを使用している
  - ※ 必要に応じてクライアントコンポーネントをオプトインできる
- RSCのメリット
  - サーバー上で実行されるため、高価なデータ取得やロジックをサーバー上に保持し、結果のみをクライアントに送信することができる
  - RSCはpromiseをサポートしており、データ取得のような非同期タスクのためのシンプルなソリューションを提供。useEffectやuseStateなどのデータ取得ライブラリを使わずに、async/await構文を使用できる
  - サーバー上で実行されるため、APIレイヤーを追加することなく、データベースに直接問い合わせることができます。
- Next.jsではデフォルトで`request waterfall`を作成する
  - `request waterfall` は、他のリクエストが完了するまで待機して順次実行していくリクエストの仕方
  - ex: リクエストAが完了するまでリクエストBは実行されない
  - 並列でデータをfetchすることで対策できる
    - JavascriptのPromise.allを使って、並列でデータをfetchすることができる

## 静的レンダリングと動的レンダリング
### 静的レンダリング
- 静的レンダリングは以下の場合に便利
  - UI にデータがない
  - 静的なブログ投稿や製品ページなど
  - ユーザー間で共有されるデータがある
- ただし、定期的に更新されるデータを含むダッシュボードには適していない可能性がある

### 動的レンダリング
- 動的レンダリングは以下の場合に便利
  - データが頻繁に変更されるアプリケーション
  - パーソナライズされたダッシュボードやユーザープロファイルなどのユーザー固有のコンテンツ
  - クッキーやURLの検索パラメータなど、リクエスト時にしかわからない情報にアクセスする
- 動的レンダリングでは、最も遅いfetchと同じ速度しか出せない
  - データがfetchされている間、ページ全体がブロックされてしまうため

- `unstable_noStore`を使用すると、データをキャッシュせずにデータを取得できる(静的レンダリングをオプトアウトできる)
  - これは実験的なAPIであり、将来変更される可能性がある。**(2023/10/29)**
  - 自分のプロジェクトで安定したAPIを使用したい場合は、セグメント設定オプションを使用することもできる(`export const dynamic = "force-dynamic".`)

## ストリーミング
- ストリーミングは、ルートを小さな"チャンク"に分割し、準備ができ次第、サーバーからクライアントに順次表示していくデータ転送技術
- ストリーミングすることで、遅いリクエストでページ全体がブロックされることを防いで、ユーザーにはページの一部が表示される
- 各チャンクのデータのフェッチとレンダリングも並行して開始され、ウォーターフォールの問題が解決されます。
- 各コンポーネントはチャンクとみなされ、それぞれが個別にストリーミングされる

### ルートグループ
- ルートグループ = ルーティング構造に影響を与えず、コンポーネントをグループ化するための仕組み
- フォルダ名に`()`をつけると、`()`内の文字列の名前でルートグループを作成する
  - ex: `(overview)`というフォルダを作成した場合、その配下のコンポーネントは`overview`という名前のルートグループになる
- ルートグループは、URLパスには直接含まれない
  - ex: `/dashboard/(overview)/page.tsx`は`/dashboard`になる
- ルートグループを使うことでルーティングに直接影響を与えずに、コンポーネントをグループ化できる
  - ex: `/dashboard/(overview)/page.tsx`と`/dashboard/(overview)/loading.tsx`がある場合、`loading.tsx`の影響は`page.tsx`にのみ反映され、`/dashboard`配下の他のコンポーネントには影響を与えない
  - `/dashboard/loading.tsx`とすると、`/dashboard/〇〇/page.tsx`などのコンポーネントがあると、そこまで、`loading.tsx`の影響を与えることになる

### `loading.tsx`
- **ページ全体をストリーミングされる**
- loading.tsxは Suspense上に構築された特別なファイルで、コンテンツの読み込み中に代替として表示する読み込みUIを作成できる
- ※ 配下のコンポーネントでも静的なものはそのまま表示し、動的なものは`loading.tsx`のものが表示される

### `<Suspense>コンポーネント`
- **ページの一部をストリーミングする**
- サスペンスを使用すると、何らかの条件が満たされるまで (データがロードされるなど)、アプリケーションのレンダリング部分を延期できる
- 動的コンポーネントをラップすると、ロード中にfallback用のコンポーネントを表示できる
- サスペンスの境界線を決める要素
  - ストリーミング中にユーザーにページをどのように体験してもらいたいか
  - どのコンテンツを優先したいか
  - コンポーネントがデータの取得に依存している場合

## 部分的なプリレンダリング(オプション)
- Next.js 14では **Partial Pre Rendering (PPR)** と呼ばれる新しいレンダリング モデルを使用できる
- PPRは、一部の部分を動的に保ちながら、ルートを　静的にレンダリングできる実験的な機能
  - ビルド時 (またはrevalidate中) に、静的な部分が事前にレンダリングされ、残りの部分(動的な部分)はユーザーがルートを要求するまで延期される
  - コンポーネントを Suspense でラップしても、コンポーネント自体が動的になるのではなく、ルートの静的部分と動的部分の間の境界として使用されることに注意

## 検索とページネーションの追加
- 検索やページネーションに`URL search params`を用いるメリット
  - **ブックマーク可能および共有可能** : 検索パラメータはURL内にあるため、ユーザーは将来の参照や共有のために、検索クエリやフィルタを含むアプリケーションの現在の状態をブックマークできる
  - **サーバー側レンダリングと初期ロード** : URLパラメーターをサーバー上で直接使用して初期状態をレンダリングできるため、サーバー レンダリングの処理が容易になる
  - **分析と追跡** : URLに検索クエリとフィルターを直接含めることで、追加のクライアント側ロジックを必要とせずに、ユーザーの行動を追跡することが容易になる
- 検索機能で使うNextが用意しているhook
  -  `useSearchParams` : 現在の URL のパラメータにアクセスできる
     -  ex )  `/dashboard/invoices?page=1&query=pending`は`{page: '1', query: 'pending'}`の場合返す
  - `usePathname` : 現在の URL のパス名を読み取ることができる
    - ex ) `/dashboard/invoices`の場合、`/dashboard/invoices`を返す
  - `useRouter` : **クライアント コンポーネント内のルート間のナビゲーション** をプログラムで有効にする。使用できる方法は複数ある

## データの変更
- `React Server Actions` : サーバー上で非同期コードを直接実行できる
  - APIエンドポイントを作成する必要がなくなる
  - 使用することでセキュリティも担保できる
    - `<form>`を使用した例
    - サーバーサイドで実行されるので、クライアント側でJavascriptが向こうの場合でも機能する
    - 内部で`POST APIエンドポイント`を作成しているので、APIエンドポイントを作成する必要がない
    ```typescript
    // Server Component
    export default function Page() {
      // Action
      async function create(formData: FormData) {
        'use server';

        // Logic to mutate data...
      }

      // Invoke the action using the "action" attribute
      return <form action={create}>...</form>;
    }
    ```
- ファイルに`'use server';`を追加することで、ファイル内で`export`された関数がサーバーアクションとしてサーバーサイドで実行される
  - これらの関数は **クライアントコンポーネント** やサーバーコンポーネントから呼び出すことができる
  - **クライアントコンポーネントからも呼び出せるのすごい!!!**
