/**
 * Import required packages
 */
const fs = require('fs-extra')
var faker = require('faker')
var Chance=require('chance')
var chance = new Chance();
var moment = require('moment')
const dateFormat = require('dateformat')

/**
 * Description: Creates random string based on possible characters and length
 * Input: chars (string), length (integer)
 * Output: randomStr (string)
 */

function randomChars(chars, length) {
    let randomStr = ''

    if (chars == null) {
        chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    }

    if (length == null) {
        length = 5
    }

    for (let i = 0; i < length; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return randomStr
}

/**
 * Description: This function takes in an array and returns one random element
 * Input: randomAry (array)
 * Output: randomAry[randomIndex] (integer)
 */
function randomizer(randomAry) {
    var randomIndex = Math.floor(Math.random() * randomAry.length)

    return randomAry[randomIndex]
}

/**
 * Description: This function randomly selects a company name
 * Input: None
 * Output: randomizer(names) (string)
 */
function randomCompanyName() {
    let names = ["HSBC", "Johnnie Walker", "Yahoo!", "Verizon Communications", "3M",
        "Cartier SA", "Sony", "Gap Inc.", "Burberry", "eBay", "BlackBerry", "Volkswagen Group",
        "Ralph Lauren Corporation", "Mitsubishi", "L'Oreal", "MasterCard", "Hyundai",
        "Coca-Cola", "Jack Daniel's", "Oracle Corporation", "Home Depot", "Chase",
        "Siemens AG", "Global Gillette", "Vodafone", "PepsiCo", "Kia Motors", "Deere & Company",
        "H&M", "Hermès", "Avon", "VISA", "Bank of America", "Adobe Systems", "Harley-Davidson Motor Company",
        "Audi", "Zara", "General Electric", "Tesco Corporation", "BMW", "Corona", "Facebook, Inc.",
        "Apple Inc.", "Intel Corporation", "IKEA", "Shell Oil Company", "Pizza Hut",
        "Sprite", "American Express", "Nintendo"
    ]

    return randomizer(names)
}

/**
 * Description: This function randomly selects a name
 * Input: None
 * Output: string literal
 */
function randomName() {
    let names = ["Evon", "Bennie", "Charla", "Fernanda", "Glayds", "Liza", "Carmine",
        "Arnette", "Allyn", "Karlene", "Jermaine", "Lael", "Alphonse", "Devin", "Ivonne",
        "Kathline", "Renea", "Adele", "Kyra", "Jonie", "Tracy", "Vallie", "Homer", "Pamelia",
        "Tracie", "Larae", "Demetra", "Trisha", "Brenna", "Rikki", "Araceli", "Jacalyn", "Trudi",
        "Cristie", "Conrad", "Numbers", "Reinaldo", "Jerrod", "Nga", "Ingeborg", "Ruthe",
        "Pandora", "Colette", "Willy", "Edwin", "Margene", "Mirian", "Joaquina", "Joye",
        "Nikki", "Erwin", "Bob", "Jill", "Andrea"
    ];

    return randomizer(names) + " " + randomChars("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 1)
}


/**
 * Takes string template stored in test_files directory and returns as a json obj
 * Input: fileLocation (string)
 * Output: templateObj (object)
 */
async function template(fileLocation) {
    let templateObj

    try {
        templateObj = await fs.readJson(fileLocation)
    } catch (err) {
        console.error(err)
    }

    return templateObj
}

module.exports = {
    randString:function(char, len){
        return char + chance.string({
            length: len,
            pool: '0123456789abcdefghijklmnopqrstuvwxyz'
        });
    },

    randEmail: function (emailDomain = "mailinator.com", len = 8) {
        let email = "test_" + chance.string({
            length: len,
            pool: '0123456789abcdefghijklmnopqrstuvwxyz'
        })

        return email + "@" + emailDomain
    },

    randNum(len) {
        return chance.string({
            length: len,
            pool: '0123456789'
        })
    },

    randCompany: function () {
        let company = randomCompanyName()

        return company
    },
    randName: function () {
        let name = randomName()

        return name
    },
    templateToObj: async function (location) {
        let retrievedTemplate = await template(location)

        return retrievedTemplate
    },
    generateUuid: async function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },
    phoneNumber: function(len=10){
        return chance.string({
            length: len,
            pool: '0123456789'
        });
    },
    serviceKey:function(len=11){
        return "serv" + chance.string({
            length: len,
            pool: '0123456789abcdefghijklmnopqrstuvwxyz'
        });
    },
    customerKey:function(len=11){
        return  "cust" + chance.string({
            length: len,
            pool: '0123456789abcdefghijklmnopqrstuvwxyz'
        });
    },
    badguid:function(){
        return "FF2214F8-5393-4B5A-B1CA-3620F85D9131"
    },
    senderemail:function(){
        return "test_dnirsse1qf@mailinator.com"
    },
    originating_fax_number:function(){
        return "1-323-555-6666"
    },destination_fax_number:function(){
        return "13235553026"
    },
    randomemail:function(emailDomain,len=5){
        let email= "test_"+ chance.string({
            length: len,
            pool: '0123456789abcdefghijklmnopqrstuvwxyz'
        });
        email=email+"@"+emailDomain
        return email
        
    },

    //Creates random boolean
	randomBoolean: function() {
		var boolAry = [true,false]
		return randomizer(boolAry)
    },
    
    //Creates a guid value
	createGUID: function() {
        function S4() {
			return (((1+Math.random())*0x10000)|0).toString(16).substring(1)
        }   
		var guid = (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
		return guid
    },
    
    //Creates random transmission_status
	randomTransmissionStatus: function()	{
		var transmissionStatusAry = ["NEW","INPROGRESS","COMPLETE","ERROR"];
		return randomizer(transmissionStatusAry);		
    },
    
    //Creates randomNum between min and max values
	randomNum: function(min,max) {
		if(min==null)
			min = 1;
		if(max==null)
			max = 1;
		return Math.floor(Math.random()*(max-min+1))+min;
    },
    
    // Creates date in format '<YYYY>-<MM>-<DD>T<HH>:<mm>:<ss>.<SSS>Z'
    createBoundDateTime: function(input) {
        var newDate = moment(new Date()).subtract(input, 'd')
        var dateFormatted = newDate.format('YYYY') + '-' + newDate.format('MM') + '-' + newDate.format('DD') + 'T' + newDate.format('HH') +':' + newDate.format('mm') + ':' + newDate.format('ss') + '.' + newDate.format('SSS') +'Z'
        return dateFormatted
    },

    // Creates unix time
    createUnixtime: function(input) {
        var newDate = moment(new Date()).subtract(input, 'd')
        var unixDate = newDate.unix()
        return unixDate
    },

    //Creates random hub
	randomHub: function(baseUrl) {
        var hub = []

        if (baseUrl.search("dev") > 0){
            hub = ["senddev1","senddev2"]
        }
        else if(baseUrl.search("test") > 0){
            hub = ["sendtest1","sendtest2"]
        }
        else {
            hub = ["atl","chd","lhr","pdx","yow"]
        }
		return randomizer(hub)
    },
    
    //Creates random fax_system
	randomFaxSystem: function() {
		//var faxSystemAry = ["EFAX","MYFAX","DOC","METFAX","FAXBOX","EFAXDEV"];
		var faxSystemAry = ["EFAX","DOC","FAXBOX","EFAXDEV"]
		return randomizer(faxSystemAry)
    },
    
    //Creates error object
	returnErrorObj: function(transmission_status) {
		var errorCodeAry = ["E01","E02","E04","E05","E06","E07","E20","E30",
			"E31","E32","E33L","E33M","E34L","E34M","E35","E36","E41",
			"E42","E43","E44","E48","E49","E51","E52","E61","E62","E63L",
			"E63M","E64L","STLAST","STMULTI"]
		var errorObj = new function() {
			this.code = ""
			this.message = ""
		}
	    switch (transmission_status) {
			case "ERROR":
				errorObj.code = randomizer(errorCodeAry)
				errorObj.message = "Error reported"
				break
			case "COMPLETE":
				errorObj.code = "SFAX"
				errorObj.message = "Successful fax"
				break
		}
        return errorObj
    },
    
    //Creates random resolution
    randomResolution: function() {
		var resolutionAry = ["STANDARD","FINE","SUPERFINE","UNKNOWN"]
		return randomizer(resolutionAry)
    },
    
    //Creates storage domain
	createStorageDomain: function(baseUrl, servicekey) {
		var env = "";
        if (baseUrl.search("dev") > 0){
            env = "dev."
        }
        else if(baseUrl.search("test") > 0){
            env = "test."
        }
        return servicekey+"@"+env+"send.messages.efax.com"
    },
    
    //Creates random cover page tags
	randomCoverPageTags: function() {
		var length = randomizer([1,2,3,4])
		var tags = "URIC"
		
		return tags.substr(0,length)
    },
    //Creates long_destination_fax_number
    longDestinationFaxNumber: function(len=44){
        return chance.string({
            length: len,
            pool: '0123456789'
        });
    },

    randPrimaryAddress: function() {
        return faker.address.streetAddress()
    },

    randSecondaryAddress: function() {
        return faker.address.secondaryAddress()
    },

    pastDate: function(pastdaysdecrement, dateformat) {
        let updated_date = dateFormat(new Date().setDate(new Date().getDate() - pastdaysdecrement), dateformat)
        return updated_date
    }    
}