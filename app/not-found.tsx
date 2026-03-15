import Image from "next/image"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <Image
        src="/notfound.svg"
        alt="Page not found"
        width={320}
        height={260}
        priority
      />
      <div className="text-center">
        <h1 className="text-2xl font-bold">ページが見つかりません</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          お探しのページは存在しないか、移動した可能性があります。
        </p>
      </div>
      <Link
        href="/"
        className="text-sm text-primary hover:underline"
      >
        トップページに戻る
      </Link>
    </div>
  )
}
