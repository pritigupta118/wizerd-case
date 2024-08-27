import { db } from "@/db"
import { notFound } from "next/navigation"
import DesignPreview from "@/app/configure/preview/DesignPreview"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

interface PageProps{
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async({ searchParams }: PageProps) => {
  const {id} = searchParams
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!id || typeof id !== 'string') {
    return notFound()
  }

   const configuration =   await db.configuration.findUnique({
    where: {id}
  })

  if (!configuration) {
    return notFound()
  }

  return (
    <DesignPreview configuration={configuration} user={user!}/>
  )
}

export default Page
