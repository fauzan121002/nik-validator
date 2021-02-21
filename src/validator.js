const fs = require('fs');
const path = require('path');

class Validator {
    //Get current year and get the last 2 digit numbers
    getCurrentYear(){
        return parseInt(new Date().getFullYear().toString().substr(-2));
    }

    //Get year in NIK
    getNIKYear(nik){
        return parseInt(nik.substr(10, 2)); 
    } 

    //Get date in NIK
    getNIKDate(nik){
        return parseInt(nik.substr(6, 2));  
    } 

    getNIKDateFull(nik, isFemale) {
        let date = parseInt(nik.substr(6, 2));
        if (isFemale) {
            date -= 40;
        }
        return date > 10 ? date.toString() : `0${date}`;
    }

  //Get subdistrict split postalcode
    getSubdistrictPostalCode(nik,location){
        return location['kecamatan'][nik.substr(0, 6)]
            .toString()
            .toUpperCase()
            .split(" -- ");
    }

    //Get province in NIK
    getProvince(nik, location){
        return location['provinsi'][nik.substr(0, 2)];
    }

    //Get city in NIK
    getCity(nik, location){
        return location['kabkot'][nik.substr(0, 4)];
    }

    //Get NIK Gender
    getGender(date){
        return date > 40 ? "PEREMPUAN" : "LAKI-LAKI";
    } 

    //Get born month
    getBornMonth(nik){
        return parseInt(nik.substr(8, 2)); 
    }
    getBornMonthFull(nik){
        return nik.substr(8, 2);
    }

    //Get born year
    getBornYear(nikYear, currentYear){
        return nikYear < currentYear
            ? `20${nikYear > 10 ? nikYear : '0' + nikYear.toString()}`
            : `19${nikYear > 10 ? nikYear : '0' + nikYear.toString()}`;
    }

    //Get unique code in NIK
    getUniqueCode(nik){
        return nik.substr(12, 4);
    }

    //Get age from nik
    getAge(birthday) { 
        let today = new Date();
        let ageDate = new Date(today.getTime() - birthday.getTime());

        return {
            years: Math.abs(ageDate.getUTCFullYear() - 1970),
            months: Math.abs(ageDate.getUTCMonth()),
            days: Math.abs(ageDate.getUTCDate() - 1)
        }
    }

    //Get next birthday
    getNextBirthday(birthday){
        let today = new Date();
        let diff = new Date(birthday.getTime() - today.getTime());
        
        return {
            months: Math.abs(diff.getUTCMonth()),
            days: Math.abs(diff.getUTCDate() - 1)
        }
    }

    //Get Zodiac from bornDate and bornMonth
    getZodiac(date, month, isFemale) {
        if (isFemale) date -= 40;

        if ((month == 1 && date >= 20) || (month == 2 && date < 19))
            return "Aquarius";

        if ((month == 2 && date >= 19) || (month == 3 && date < 21))
            return "Pisces";

        if ((month == 3 && date >= 21) || (month == 4 && date < 20)) 
            return "Aries";

        if ((month == 4 && date >= 20) || (month == 5 && date < 21))
            return "Taurus";

        if ((month == 5 && date >= 21) || (month == 6 && date < 22))
            return "Gemini";

        if ((month == 6 && date >= 21) || (month == 7 && date < 23))
            return "Cancer";

        if ((month == 7 && date >= 23) || (month == 8 && date < 23)) 
            return "Leo";

        if ((month == 8 && date >= 23) || (month == 9 && date < 23)) 
            return "Virgo";

        if ((month == 9 && date >= 23) || (month == 10 && date < 24))
            return "Libra";

        if ((month == 10 && date >= 24) || (month == 11 && date < 23))
            return "Scorpio";

        if ((month == 11 && date >= 23) || (month == 12 && date < 22))
            return "Sagitarius";

        if ((month == 12 && date >= 22) || (month == 1 && date < 20))
            return "Capricorn";

        return "Zodiak tidak ditemukan";
    }

    parse(nik) {
        if(typeof nik == "number"){
            nik = nik.toString();
        }
        
        let location = this.getLocationAsset();

        //Check NIK and make sure is correct
        if (this.validate(nik, location)) {
            let currentYear = this.getCurrentYear();
            let nikYear = this.getNIKYear(nik);
            let nikDate = this.getNIKDate(nik);
            let gender = this.getGender(nikDate);

            let nikDateFull = this.getNIKDateFull(nik, gender == "PEREMPUAN");

            let subdistrictPostalCode = this.getSubdistrictPostalCode(nik, location);
            let province = this.getProvince(nik, location);
            let city = this.getCity(nik, location);
            let subdistrict = subdistrictPostalCode[0];
            let postalCode = subdistrictPostalCode[1];

            let bornMonth = this.getBornMonth(nik);
            let bornMonthFull = this.getBornMonthFull(nik);
            let bornYear = this.getBornYear(nikYear, currentYear);

            let uniqueCode = this.getUniqueCode(nik);
            let zodiac = this.getZodiac(nikDate, bornMonth, gender == "PEREMPUAN");
            let age = this.getAge(new Date(`${bornYear}-${bornMonthFull}-${nikDateFull}`));
            let nextBirthday = this.getNextBirthday(new Date(`${bornYear}-${bornMonthFull}-${nikDateFull}`));

            return {
                nik: nik ?? " ",
                uniqueCode: uniqueCode ?? " ",
                gender: gender ?? " ",
                bornDate: `${nikDateFull}-${bornMonthFull}-${bornYear}` ?? "",
                age: `${age.years} tahun, ${age.months} bulan, ${age.days} hari` ?? " ",
                ageYear: age.years ?? 0,
                ageMonth: age.months ?? 0,
                ageDay: age.days ?? 0,
                nextBirthday: `${nextBirthday.months} bulan ${nextBirthday.days} hari lagi` ?? " ",
                zodiac: zodiac ?? " ",
                province: province ?? " ",
                city: city ?? " ",
                subdistrict: subdistrict ?? " ",
                postalCode: postalCode ?? " ",
                valid: true ?? false            
            }
        }

        return {
            valid: false            
        }            
    }

    //Validate NIK and make sure the number is correct
    validate(nik, location) {
        return nik.length == 16 &&
            location['provinsi'][nik.substr(0, 2)] != null &&
            location['kabkot'][nik.substr(0, 4)] != null &&
            location['kecamatan'][nik.substr(0, 6)] != null;
    }

    // Load location asset like province, city and subdistrict
    // from local json data
    getLocationAsset(){
        let result = fs.readFileSync(path.join(__dirname, 'assets/wilayah.json'));
        
        return JSON.parse(result);
    }
}

module.exports = Validator;