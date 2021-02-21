## NIK Validator

NIK Validator adalah Versi Javascript dari [NIK Validator](https://pub.dev/packages/nik_validator).

NIK Validator berfungsi untuk memvalidasi dan mengonversi 16 digit kode NIK kita menjadi informasi yang bisa dibaca.

Cara menggunakan NIK Validator :
* Setup
```bash
cd folder-project
npm init -y
```
* Install Library
```bash
npm install nik-validator
```
* Penggunaan
```js
const Validator = require('nik-validator');

// NIK didapat secara gratis dari internet sebagai contoh.
let validator = new Validator().parse(3271046504930002);

if(validator.valid){
    console.log(validator);
}
```