#!/usr/bin/env node

import 'console.table'
import rp from 'request-promise'
import cheerio from 'cheerio'
import ora from 'ora'
import prop from 'ramda/src/prop.js'
import sort from 'ramda/src/sort.js'
import descend from 'ramda/src/descend.js'

import { highlight } from './helpers.js'
import exchangeHouses from './exchangeHouses.js'

const spinner = ora('Loading...')
spinner.start()

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

const sortedPrices = sort(descend(prop('Compra')), prices).slice(0, 10)
const bestOption = sortedPrices[0].Empresa
const { url, coupon } = exchangeHouses[bestOption]

console.log('\n')
console.table(sortedPrices)
spinner.succeed('💰🤑💰')
console.log('\n')
console.log(`
  Best option for today: ${highlight(bestOption)}
  Website: ${highlight(url)}
  ${
    coupon && `Apply this coupon if you want more money 😏 ${highlight(coupon)}`
  }
`)
console.log('\n')
