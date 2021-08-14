#!/usr/bin/env node

import 'console.table'
import rp from 'request-promise'
import cheerio from 'cheerio'

const options = {
  uri: 'https://cuantoestaeldolar.pe/',
  transform: (body) => cheerio.load(body),
}

const $ = await rp(options)

const prices = Array.from($('.list-change-online > .tb_dollar')).map((item) => {
  const title = $(item).find('h3 > a').text().trim()
  const buy = $(item).find('.tb_dollar_compra').text().trim()
  const sell = $(item).find('.tb_dollar_venta').text().trim()

  return {
    Empresa: title,
    Compra: buy,
    Venta: sell,
  }
})

console.table(prices)
