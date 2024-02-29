/**
 * Import required packages
 */
const config = require('config')
const Testrail = require('testrail-api')
const beautify = require('json-beautify')
/**
 * Set variables
 */
const testrail = new Testrail({
    host: config.get('testrail.host'),
    user: config.get('testrail.user'),
    password: config.get('testrail.password')
})

let run_id = process.env.npm_config_TestRunId //514

before(function () {
    if(!run_id)
        run_id = 514 //defaults to this
    //console.log(run_id);
    testrail.getRun(/*RUN_ID=*/ run_id)
        .then(function (result) {
            //console.log(beautify(result.body, null, 2, 80))
        }).catch(function (error) {
            console.log('error', error.message)
            process.exit()
        })
})
afterEach(function () {
    let comment = this.currentTest.err
    let status_id = ''
    let case_id = ''
    comment == null ? (status_id = 1) : (status_id = 5, comment = comment.toString()) //status_id: 1 = pass, 5 = fail
    let title = this.currentTest.title
    let regex = /^C[0-9]+/g
    if (title.match(regex)) {
        let tempString = title.match(regex)[0]
        //console.log(title.match(regex)[0])
        //console.log(tempString.length)
        case_id = title.substring(1, tempString.length);
        // console.log("id"+case_id)
        // console.log("runid"+run_id)
        testrail.addResultForCase( /*RUN_ID=*/ run_id, /*CASE_ID=*/ case_id, /*CONTENT=*/ {
            status_id,
            comment
        })
        .then(function (result) {
                //console.log(beautify(result.body, null, 2, 80))
        })
        .catch(function (error) {
                console.log('error', error.message)
        })
    } else {
        console.log('\tNo valid Testrail test case id found.')
    }
})