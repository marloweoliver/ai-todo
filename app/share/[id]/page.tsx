import { getSharedData } from "@/lib/actions"
import { SharePreview } from "@/components/share-preview"

export default async function SharePage({ params }: { params: { id: string } }) {
  const data = await getSharedData(params.id)

  if (!data) {
    return (
      <div className="container max-w-2xl py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Share not found</h1>
          <p className="text-muted-foreground">This share link may have expired or does not exist.</p>
        </div>
      </div>
    )
  }

  return <SharePreview data={data} />
}

