app.post('/generateByBlocks', (req, res, next) => {
//     const token = req.body.token;
//     const group = req.body.group;
//     const weekday = req.body.weekday;
//     // console.log(req.body);
//     if (token)
//     {
//         jwt.verify(token, privateJwtKey, function (err, decoded) {
//             if (err)
//             {
//                 return res.status(500).json({ msg: err.message, err });
//             } else
//             {
//                 const Block = require('./models/block')[decoded.spec];

//                 if (weekday == 'ALL')
//                 {
//                     Block.find({}, null, { sort: 'критерий сортировки' }, function (errF, resF) {
//                         if (errF) { return res.status(500).json({ err: errF }) }
//                     });
//                 } else
//                 {
//                     Block.findOne({ weekday }, null, { sort: 'критерий сортировки' }, function (errF, resF) {
//                         if (errF) { return res.status(500).json({ err: errF }) };
//                         if (resF)
//                         {
//                             console.log(resF);
//                             console.log(group);
//                             if (resF.groups[group])
//                             {
//                                 for (number in resF.groups[group])
//                                 {
//                                     const date = resF.groups[group][number];
//                                     console.log('=========================');
//                                     console.log('Группа: ' + group);
//                                     console.log('Номер урока: ' + number);
//                                     console.log('Список уроков: ');
//                                     for (let i = 1; i <= 4; i++)
//                                     {
//                                         const lesson = resF.groups[group][i];
//                                         let lessonsGroupArray = [];
//                                         let lessonObj = new Day();
//                                         let lessonObj = new Day();
//                                         console.log(lesson);
//                                         lesson.lessonDates.forEach((date) => {
//                                             switch (Number(number))
//                                             {
//                                                 case 1:
//                                                     if (lesson)
//                                                     {
//                                                         lessonObj = {
//                                                             title: lesson.lessonName,
//                                                             type: lesson.lessonType,
//                                                             teacher: lesson.lessonTeacher,
//                                                             link: lesson.lessonLink,
//                                                         };
//                                                     } else
//                                                     {
//                                                         lessonObj = {
//                                                             title: 'none'

//                                                         };
//                                                     }
//                                                     break;
//                                             }

//                                             lessonObj = {};
//                                         })
//                                         console.log(lessonsArray);
//                                     }
//                                     resF.groups[group][number].forEach((lesson) => {

//                                     });
//                                     console.log('=========================');
//                                     // resF.groups[group][number].lessonDates.forEach((date) => {
//                                     //     console.log(number + ') ' + date);
//                                     // })
//                                     // switch (Number(number))
//                                     // {
//                                     //     case 1:
//                                     //         if (lesson.title != 'none')
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(09, 00),
//                                     //                 end: date.setUTCHours(10, 20),
//                                     //                 title: lesson.title + '(' + lesson.type + ')',
//                                     //                 color: lesson.color,
//                                     //                 display: lesson.display || "auto",
//                                     //                 url: lesson.link,
//                                     //                 extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }
//                                     //             });
//                                     //         } else
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(09, 00),
//                                     //                 end: date.setUTCHours(10, 20),
//                                     //                 extendedProps: { lessonNumber: number }
//                                     //             });
//                                     //         }
//                                     //         break;
//                                     //     case 2:
//                                     //         if (lesson.title != 'none')
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(10, 30),
//                                     //                 end: date.setUTCHours(11, 50),
//                                     //                 display: lesson.display || "auto",
//                                     //                 title: lesson.title + '(' + lesson.type + ')',
//                                     //                 color: lesson.color,
//                                     //                 backgroundColor: lesson.backgroundColor,
//                                     //                 url: lesson.link,
//                                     //                 extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }
//                                     //             });
//                                     //         } else
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(10, 30),
//                                     //                 end: date.setUTCHours(11, 50),
//                                     //                 extendedProps: { lessonNumber: number }
//                                     //             });
//                                     //         }
//                                     //         break;
//                                     //     case 3:
//                                     //         if (lesson.title != 'none')
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 display: lesson.display || "auto",
//                                     //                 start: date.setUTCHours(12, 10),
//                                     //                 end: date.setUTCHours(13, 30),
//                                     //                 title: lesson.title + '(' + lesson.type + ')',
//                                     //                 color: lesson.color,
//                                     //                 url: lesson.link,
//                                     //                 backgroundColor: lesson.backgroundColor,
//                                     //                 extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }

//                                     //             });
//                                     //         } else
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(12, 10),
//                                     //                 end: date.setUTCHours(13, 30),
//                                     //                 extendedProps: { lessonNumber: number }
//                                     //             });
//                                     //         }
//                                     //         break;
//                                     //     case 4:
//                                     //         if (lesson.title != 'none')
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(12, 10),
//                                     //                 end: date.setUTCHours(13, 30),
//                                     //                 title: lesson.title + '(' + lesson.type + ')',
//                                     //                 color: lesson.color,
//                                     //                 display: lesson.display || "auto",
//                                     //                 backgroundColor: lesson.backgroundColor,
//                                     //                 url: lesson.link,
//                                     //                 extendedProps: { teacher: lesson.teacher, lessonNumber: number, date: date, type: lesson.type, title: lesson.title }
//                                     //             });
//                                     //         } else
//                                     //         {
//                                     //             BDresponce.push({
//                                     //                 start: date.setUTCHours(13, 40),
//                                     //                 end: date.setUTCHours(15, 00),
//                                     //                 extendedProps: { lessonNumber: number }
//                                     //             });

//                                     //         }
//                                     //         break;
//                                     //     default:
//                                     //         break;
//                                     // }
//                                 }
//                             } else
//                             {
//                                 return res.status(404).json({ msg: 'блоки для этой группы в этот день недели не найдены' })
//                             }
//                         } else
//                         {
//                             return res.status(404).json({ msg: 'блоки на этот день недели не найдены' });
//                         }
//                     }
//                     );
//                 }

//             }
//         });
//     } else
//     {
//         return res.status(405).json({ msg: 'token not sended', });
//     }


// });

