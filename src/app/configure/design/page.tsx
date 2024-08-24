import { db } from "@/db"
import { notFound } from "next/navigation"
import DesignConfigurator from "./DesignConfigurator"


interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined
  }
}

const Page = async({searchParams}: PageProps) => {
  const { id } = searchParams //In Next.js, 'searchParams' refer to the query string parameters in a URL, which come after the ? in a URL. These parameters allow you to pass data to your pages through the URL.

  // If there is no id passed in this step

  if (!id || typeof id !== "string") {
    return notFound()
  }

  // After getting the id let's find out in the database with this id

  const configuration = await db.configuration.findUnique({
    where: { id }
  })

  // if there is no such configuration which this id
  if (!configuration) {
    return notFound()
  }

  // if configuration found then destructure the propeties
  const { imgUrl, width, height } = configuration

   return <DesignConfigurator 
   configId={configuration.id}
   imgUrl={imgUrl}
   imgDimensions={{width, height}}
   />
  
}

export default Page
