
const cheerio = require('cheerio')
const axios = require('axios')

// /**Medlineplus****************** */
// const getAllLabs = async (req, res) => {
//   console.log('labs')
//   try {
//     const allLabs = []
//     let labs = await axios.get('https://medlineplus.gov/lab-tests/')
//     //console.log(labs, 'labs2')
//     let $ = await cheerio.load(labs.data)

//     const div = $('#section_A > .withident >li').map((index, lab) => {
//       const labName = $(lab).find('a').text()
//       const url = $(lab).find('a').attr('href')
//       allLabs.push({ lab: labName, url: url })
//       console.log('labName', labName, url)
//     })

//     res.status(200).send(allLabs)
//   } catch (error) {
//     console.error(error)
//     res
//       .status(500)
//       .send({ error: 'An error occurred while fetching labs data.' })
//   }
// }

const getLabsByFirstLetter = async (req, res) => {
  console.log('labsletetr')
  try {
    const allLabsByLetter = []
    let labs = await axios.get('https://medlineplus.gov/lab-tests/')
    //console.log(labs, 'labs2')
    let $ = await cheerio.load(labs.data)

    const letter = req.params.letter.toUpperCase()
    console.log('Letter', letter)

    const div = $(`#section_${letter} > .withident >li`).map((index, lab) => {
      const labName = $(lab).find('a').text()
      const url = $(lab).find('a').attr('href')
      allLabsByLetter.push({ lab: labName, url: url })

      console.log('allLabsByLetter', allLabsByLetter)
    })

    if (allLabsByLetter.length > 0) {
      res.status(200).send(allLabsByLetter)
    } else {
      res.status(404).send({ msg: 'No labs found' })
    }
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .send({ error: 'An error occurred while fetching labs data.' })
  }
}

module.exports = {

  //getAllLabs,
  getLabsByFirstLetter
}
