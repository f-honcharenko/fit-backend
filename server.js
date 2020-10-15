const express = require('express');
const bodyPaster = require('body-parser');
const cors = require('cors');
var fs = require('fs');
const e = require('express');
// 
//const ExcelJS = require('exceljs');
// 

const app = express();
app.use(cors());
app.use(bodyPaster.json());
app.use(bodyPaster.urlencoded({ extended: false }));

//routes

app.post('/timetables/1/add', (req, res, next) => {
    let data = req.body;
    const spec = req.body.spec;
    //read the timуеtable
    fs.readFile('./data/'+spec+'/timetable.json', 'utf8', function(err, contents) {
        if (err) {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        //pasrsing
        data.lessonDate.forEach(element => {
            console.log(element);
            if (file[element]) {
                data.lessonGroup.forEach(group => {
                    console.log();
                    let tempData = data.lessonTime;
                    if (file[element][group]) { 
                        if (file[element][group][data.lessonTime]) { 
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;      
                            file[element][group][data.lessonTime].color = data.lessonColor;      
                            file[element][group][data.lessonTime].link = data.lessonLink;      
                        } else {
                            file[element][group][data.lessonTime] = {};    
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;                    
                            file[element][group][data.lessonTime].color = data.lessonColor;      
                            file[element][group][data.lessonTime].link = data.lessonLink;      
                        }
                    } else {
                            file[element][group] = {};    
                            file[element][group][data.lessonTime] = {};    
                            file[element][group][data.lessonTime].title = data.lessonName;
                            file[element][group][data.lessonTime].type = data.lessonType;
                            file[element][group][data.lessonTime].teacher = data.lessonTeacher;                    
                            file[element][group][data.lessonTime].color = data.lessonColor;      
                            file[element][group][data.lessonTime].link = data.lessonLink; 
                    }
                });
            } else {
                file[element] = {};
                data.lessonGroup.forEach(group => {
                    file[element][group] = {};
                    file[element][group][data.lessonTime] = {};
                    file[element][group][data.lessonTime].title = data.lessonName;
                    file[element][group][data.lessonTime].type = data.lessonType;
                    file[element][group][data.lessonTime].teacher = data.lessonTeacher;
                    file[element][group][data.lessonTime].color = data.lessonColor;      
                    file[element][group][data.lessonTime].link = data.lessonLink;      
                });
            }
        });

        //save the new timetable
        fs.writeFileSync('./data/'+spec+'/timetable.json', JSON.stringify(file, null, 2), function (err, contents) { 
            if (err) return res.status(500).json(err);
            res.status(200);
        });
    });
});


app.post('/timetables/1/getCal', (req, res, next) => {
    const group = req.body.group;
    const dateStart = req.body.start;
    const spec = req.body.spec;
    const year = new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 15)).getFullYear();
    const dateEnd = req.body.end;
    let responce = [];
    //read the timetable;
    fs.readFile('./data/'+spec+'/timetable.json', 'utf8', function(err, contents) {
        if (err) {
            return res.status(500).json(err);
        }
        let file = JSON.parse(contents);
        for (key in file) {
            //!!!REWEITE THIS BLOCK!!!
            if ((key >= dateStart) && (key <= dateEnd)) {
                for (number in file[key][group]) {
                    let date = new Date(key);
                    date.setDate(date.getDate() + 1);
                    switch (Number(number)) { 
                        case 1:      
                            console.log(file[key][group][number]);
                    responce.push({
                        start: date.setHours(09,00),
                        end: date.setHours(10,20),
                        title: file[key][group][number].title+'('+file[key][group][number].type+')',
                        color: file[key][group][number].color,
                        url: file[key][group][number].link,
                        extendedProps: {teacher : file[key][group][number].teacher}
                    });
                    break;
                        case 2:      
                    responce.push({
                        start: date.setHours(10,30),
                        end: date.setHours(11,50),
                        title: file[key][group][number].title+'('+file[key][group][number].type+')',
                        color: file[key][group][number].color,
                        url: file[key][group][number].link,
                        extendedProps: {teacher : file[key][group][number].teacher}
                    });
                    break;
                        case 3:      
                    responce.push({
                        start: date.setHours(12,10),
                        end: date.setHours(13,30),
                        title: file[key][group][number].title+'('+file[key][group][number].type+')',
                        color: file[key][group][number].color,
                        url: file[key][group][number].link,
                        extendedProps: {teacher : file[key][group][number].teacher}
                    });
                    break;
                        case 4:      
                    responce.push({
                        start: date.setHours(13,40),
                        end: date.setHours(15,00),
                        title: file[key][group][number].title+'('+file[key][group][number].type+')',
                        color: file[key][group][number].color,
                        url: file[key][group][number].link,
                        extendedProps: {teacher : file[key][group][number].teacher}
                    });
                    break;
                        default:
                            break;
                    }
                }
                
            }
        }
        //
        //save the new timtable
        fs.readFile('./data/'+spec+'/birthday.json', 'utf8', function (err, contents) { 
            if (err) return res.status(500).json(err);
            let file = JSON.parse(contents);
            for (key in file) {
                file[key].forEach((el) => { 
                    let BDay = {
                        start: new Date(key).setFullYear(year),
                        title: '🎉'+el +' ('+ (year-new Date(key).getFullYear())+ ' л.)' ,
                        allDay: true,
                        color: '#ff5733'
                    }
                    responce.push(BDay);
                })
            }
        res.json(responce).status(200);
        });
    });

});


//express start
const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('Servver running on port ' + port);
}); 


//PARSING BITHDAY FROM XLSX
// var workbook = new ExcelJS.Workbook();
// workbook.xlsx.readFile('./data/birthday.xlsx')
//     .then(function (file, error) {
//         let BDays = {};
//         // console.log(file._worksheets[1]._rows[52]._cells[0]._value.model.value)
//         // console.log(file._worksheets[1]._rows.length)
//         let array = file._worksheets[1]._rows;
//         array.forEach((el) => { 
//             // console.log(el._cells[0]._value.model.value + ' ' + el._cells[1]._value.model.value)
//             // BDays[el._cells[1]._value.model.value] = {}
//             if (BDays[el._cells[1]._value.model.value]) {
//                 BDays[el._cells[1]._value.model.value].push(el._cells[0]._value.model.value);
//             } else {
//                 BDays[el._cells[1]._value.model.value] = [];
//                 BDays[el._cells[1]._value.model.value].push(el._cells[0]._value.model.value);
//             }
//         })
//         // console.log(BDays);
//         // use workbook

//         fs.writeFileSync('./data/birthday.json', JSON.stringify(BDays, null, 2), function (err, contents) {
//             console.log(err)
//             console.log(contents)
//         });
//     });