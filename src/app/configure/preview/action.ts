"use server"

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products"
import { db } from "@/db"
import { stripe } from "@/lib/stripe"
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types"
import { Order } from "@prisma/client"



export const createCheckoutSession = async({configId, user} : {configId: string,
  user: KindeUser | null
}) => {
const configuration = await db.configuration.findUnique({where: {id: configId}})

if(!configuration){
  throw new Error('Configuration not found')
}


if (!user) {
  throw new Error('You need to be logges in')
}


const { material, finish } = configuration

let price = BASE_PRICE
if (material === 'polycarbonate') {
  price += PRODUCT_PRICES.material.polycarbonate
}
if (finish === 'textured') {
  price += PRODUCT_PRICES.finish.textured
}

let order: Order|undefined = undefined

const existingOrder = await db.order.findFirst({
  where: {
    userId: user.id,
    configurationId: configuration.id
  }
})




if(existingOrder){
  order = existingOrder
}else {
  order = await db.order.create({
    data: {
      amount: price / 100,
      userId: user.id,
      configurationId: configuration.id
    }
  })
}

const product = await stripe.products.create({
  name: "Customer iPhone Case",
  default_price_data: {
    currency: "USD",
    unit_amount: price,
  
  }
})

const stripeSession = await stripe.checkout.sessions.create({
  success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
  cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
  payment_method_types: ['card'],
  mode: 'payment',
  shipping_address_collection: {allowed_countries: ['DE','US', 'IN']},
  metadata: {
    userId: user.id,
    orderId: order.id
  },
  line_items: [{
    price: product.default_price as string,
    quantity: 1
  }]
})

return {url: stripeSession.url}

}