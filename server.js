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

app.put('/options/group/addnew', (req, res, next) => {
    console.log(req.body);
    fs.readFile('./data/options.json', 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }
        let file = JSON.parse(contents);
        let pattern = {
            id: "id",
            users: "user",
            name: "ПП11/1",
            spec: "ПП1"
        };
        let name = req.body.groupName;
        let spec = req.body.groupSpec;
        file.groups[spec+name] = {};
        file.groups[spec+name] = pattern;
        console.log('1',file.groups);
        file.groups[spec+name].name = spec+name;
        file.groups[spec+name].spec = spec;
        file.groups[spec+name].id = +file.groups.length+1;
        console.log('FILE',file);
        fs.writeFileSync('./data/options.json', JSON.stringify(file, null, 2), function (err, contents) { 
            console.log(err)
            console.log(contents)
        });
        // res.json(JSON.parse(contents));
    });
});

app.get('/options/get', (req, res, next) => {
    console.log(req.body);
    fs.readFile('./data/options.json', 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }
        res.json(JSON.parse(contents));
    });
});

app.put('/options/teachers/addnew', (req, res, next) => {
    console.log(req.body);
    fs.readFile('./data/options.json', 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }
        let teacherFIO = req.body.FIO;
        let file = JSON.parse(contents);
        console.log(file.teachers);
        file.teachers.push(teacherFIO);
        console.log(file.teachers);
        fs.writeFileSync('./data/options.json', JSON.stringify(file, null, 2), function (err, contents) { 
            if (err) return err
            console.log(contents)
        });

    });
});

app.post('/timetables/1/add', (req, res, next) => {
    let data = req.body;
    console.log(data);
    fs.readFile('./data/ИПЗ-3/timetable.json', 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }
        let file = JSON.parse(contents);
        // console.log(file);
        // let dates 
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
                // file[element][data.lessonTime] = {};
            }
        });



        
        fs.writeFileSync('./data/ИПЗ-3/timetable.json', JSON.stringify(file, null, 2), function (err, contents) { 
            if (err) return err
            console.log(contents)
        });
        res.status(200);
    });
});

app.get('/timetables/1/get', (req, res, next) => {
    console.log(req.body);
    fs.readFile('./data/timetable.json', 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }
        res.json(JSON.parse(contents));
    });
});


app.post('/timetables/1/getCal', (req, res, next) => {
    const group = req.body.group;
    const dateStart = req.body.start;
    const spec = req.body.spec;
    const year = new Date(new Date(dateStart).setDate(new Date(dateStart).getDate() + 15)).getFullYear();
    const dateEnd = req.body.end;
    let responce = [];
    // console.log('sart'+dateStart);
    // console.log('end'+dateEnd);
    fs.readFile('./data/'+spec+'/timetable.json', 'utf8', function(err, contents) {
        if (err) {
            return console.log(err);
        }
        let file = JSON.parse(contents);
        // console.log(file);
        for (key in file) {
            // console.log(new Date(key).setHours(09,00));
            // console.log( );
            if ((key >= dateStart) && (key <= dateEnd)) {
                for (number in file[key][group]) {
                    let event;
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
                    // console.log(event);
                }
                // console.log(key+' '+key.substr(0,11));
                
            }
        }
        // 
        // 
        let res2 = [];
        fs.readFile('./data/'+spec+'/birthday.json', 'utf8', function (err, contents) { 
            if (err) {
                return console.log(err);
            }
            let file = JSON.parse(contents);
            // responce = [];
            
            // console.log(file);
            for (key in file) {
                // console.log();
                file[key].forEach((el) => { 
                    let BDay = {
                        start: new Date(key).setFullYear(year),
                        title: '🎉'+el +' ('+ (year-new Date(key).getFullYear())+ ' л.)' ,
                        allDay: true,
                        color: '#ff5733'
                    }
                    responce.push(BDay);
                    // console.log(BDay);
                })
                
                // console.log(BDay);
                // console.log(res2.length);
    }
    // console.log(res2);
    res.json(responce).status(200);
        
        });
    });

});

const port = process.env.PORT || 5000;
app.listen(port, (err) => {
    if (err) return console.log(err);
    console.log('Servver running on port ' + port);
}); 


//ПАРСИНГ ДР
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