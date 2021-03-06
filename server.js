 // v1.0.0
var express = require('express'),
    path = require('path'),
    nodeMailer = require('nodemailer'),
    bodyParser = require('body-parser');
var handlebars = require('handlebars');
var fs = require('fs');
var CONFIG_port         = process.env.PORT  || '3001';


ReS = function(res, data, code){ // Success Web Response
    let send_data = {success:true};

    if(typeof data == 'object'){
        send_data = Object.assign(data, send_data);//merge the objects
    }

    if(typeof code !== 'undefined') res.statusCode = code;

    return res.json(send_data)
};

var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};


 var transporter = nodeMailer.createTransport({
    host: 'mail.buustores.com',
    port: 465,
    secure: true,
    tls: {
        rejectUnauthorized:false
    },
    auth: {
        user: 'notificaciones@buustores.com',
        pass: 'buunotificaciones*202020202'
    }
});
 
/*
var transporter = nodeMailer.createTransport({
    service : 'gmail',
    auth: {
        user: 'cruz.juanjose@gmail.com',
        pass: 'Linda*09876'
    }
}); */
const port = normalizePort(CONFIG_port || '3000');



    var app = express();
    app.set('trust proxy', true);
app.set('port', port);
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
   // var port = 3001;
    app.get('/', function (req, res) {
      res.render('index');
    });


 app.post('/resendcontrasena', function (req, res) {

     readHTMLFile(__dirname + '/views/Emailstemplates/resendpassword.html', function(err, html) {
         var template = handlebars.compile(html);
         var replacements = {
             newpass: req.body.linkactivacion,
             name: req.body.usuariobuu
         };
         var htmlToSend = template(replacements);
         let mailOptions = {
             from: 'notificaciones@buustores.com', // sender address
             to: req.body.email + ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
             subject: req.body.subject, // Subject line
             html: htmlToSend // html body
         };

         transporter.verify(function(error, success) {
             if (error) {
                 console.log(error);
             } else {

                 transporter.sendMail(mailOptions, (error, info) => {
                     if (error) {
                         return console.log(error);
                     }
                     console.log('Message %s sent: %s', info.messageId, info.response);
                     return ReS(res, {descripcion: 'Correo enviado' });
                 });

             }
         });

     });

 })   ;

 app.post('/rpt_cuadrediario', function (req, res) {

    readHTMLFile(__dirname + '/views/Emailstemplates/Rpt_cuadrediariodelivery.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            newpass: req.body.linkactivacion,
            name: req.body.usuariobuu,
            detalles: req.body.detalles
        };
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: 'notificaciones@buustores.com', // sender address
            to: 'cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
            subject: 'Reporte Automatico Cuadre Diario sobre recolecciones', // Subject line
            html: htmlToSend // html body
        };

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return ReS(res, {descripcion: 'Correo enviado' });
                });

            }
        });

    });

})   ;



 app.post('/send-activateacountemailforautomaticorder', function (req, res) {
    readHTMLFile(__dirname + '/views/Emailstemplates/newcustomerbyautomaticorder.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            usuariobuu: req.body.usuariobuu,
            linkdeactivacion: req.body.linkdeactivacion,
            nombreusuariobuu: req.body.nombreusuariobuu,
            nombrestore: req.body.nombrestore
        };
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: 'notificaciones@buustores.com', // sender address
            to: req.body.email + ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
            subject: req.body.subject, // Subject line
            html: htmlToSend // html body
        };
        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return ReS(res, {descripcion: 'Correo enviado' });
                });
            }
        });

    });


});



  app.post('/send-activateacountemail', function (req, res) {

      readHTMLFile(__dirname + '/views/Emailstemplates/activateaccount.html', function(err, html) {
          var template = handlebars.compile(html);
          var replacements = {
              usuariobuu: req.body.usuariobuu,
              linkdeactivacion: req.body.linkactivacion
          };
          var htmlToSend = template(replacements);
          let mailOptions = {
              from: 'notificaciones@buustores.com', // sender address
              to: req.body.email, // list of receivers
              subject: req.body.subject, // Subject line
              html: htmlToSend // html body
          };

          transporter.verify(function(error, success) {
              if (error) {
                  console.log(error);
              } else {

                  transporter.sendMail(mailOptions, (error, info) => {
                      if (error) {
                          return console.log(error);
                      }
                      console.log('Message %s sent: %s', info.messageId, info.response);
                      return ReS(res, {descripcion: 'Correo enviado' });
                  });

              }
          });

      });


  });


    app.post('/send-newordertoproveedor', function (req , res) {
console.log('Enviando correo al cliente o proveedor de su nueva orden');
        readHTMLFile(__dirname + '/views/Emailstemplates/pedidoenviado.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                username: req.body.firstname +' '+  + req.body.lastname,
                storename:  req.body.storename,
                pedido: req.body.pedido,
                Nickname: req.body.Nickname,
                cliente_nombre: req.body.firstname +' '+  + req.body.lastname,
                Direccionenvio: req.body.Direccionenvio  ,
                detalles: req.body.detalles,
                tracking :req.body.tracking,
                vcuerpo: req.body.vcuerpo,
                vheader: req.body.vheader
            };
            var htmlToSend = template(replacements);
            let mailOptions = {
                from: 'notificaciones@buustores.com', // sender address
                to: req.body.to+ ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
                subject: req.body.subject, // Subject line
                html: htmlToSend // html body
            };

            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        return ReS(res, {descripcion: 'Correo enviado' });
                    });

                }
            });

        });


});



app.post('/send-newordertoproveedortest', function (req , res) {

    console.log(JSON.stringify(req.body));
    bode = JSON.parse(JSON.stringify(req.body.usuariobuu));
    console.log('Enviadno correo al cliente de su pedido fue enviado ');

    readHTMLFile(__dirname + '/views/Emailstemplates/pedidoenviado.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            username: bode.firstname +' '+  + bode.lastname,
            storename:  bode.storename,
            pedido: bode.pedido,
            Nickname: bode.Nickname,
            cliente_nombre: bode.firstname +' '+  + bode.lastname,
            Direccionenvio: bode.Direccionenvio  ,
            detalles: bode.detalles,
            tracking :bode.tracking,
            vcuerpo: bode.vcuerpo,
            vheader: bode.vheader,
            token: bode.token
        };
        console.log(replacements);
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: 'notificaciones@buustores.com', // sender address
            to: bode.to + ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
            subject: bode.subject, // Subject line
            html: htmlToSend // html body
        };

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
                return ReS(res, {descripcion: htmlToSend });
            } else {

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return ReS(res, {descripcion: htmlToSend });
                        
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return ReS(res, {descripcion: 'Correo enviado' });
                });

            }
        });

    },error =>{
        return ReS(res, {descripcion: 'Error en el html' });
    });


});




app.post('/send-updateshipping', function (req , res) {

    readHTMLFile(__dirname + '/views/Emailstemplates/statusshipping.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: req.body.firstname,
            lastname: req.body.lastname,
            storename:  req.body.storename,
            orderid: req.body.orderid,
            nickname: req.body.nickname,
            address1: req.body.address1,
            address2: req.body.address2,
            postcode: req.body.postcode,
            subtotal: req.body.subtotal,
            mensaje: req.body.mensaje,
            arriveddate: req.body.arriveddate,
            shipping: req.body.shipping,
            Total: req.body.Total,
            tracking :req.body.tracking
        };
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: 'notificaciones@buustores.com', // sender address
            to: req.body.to + ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
            subject: req.body.subject, // Subject line
            html: htmlToSend // html body
        };

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return ReS(res, {descripcion: 'Correo enviado' });
                });

            }
        });

    }); 


});




app.post('/send-neworderproveedormsg', function (req , res) {
console.log('enviando al proveedor que tiene un pedidio nuevo' +req.body.to);
    readHTMLFile(__dirname + '/views/Emailstemplates/pedidostore.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            username: req.body.customer_firstname,
            storename:  req.body.storename,
            pedido: req.body.pedido,
            Nickname: req.body.Nickname,
            cliente_nombre: req.body.customer_firstname,
            Direccionenvio: req.body.Direccionenvio  ,
            detalles: req.body.detalles,
            tracking :req.body.tracking,
            vcuerpo: req.body.vcuerpo,
            vheader: req.body.vheader
        };
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: 'notificaciones@buustores.com', // sender address
            to: req.body.to + ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
            subject: req.body.subject, // Subject line
            html: htmlToSend // html body
        };

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return ReS(res, {descripcion: 'Correo enviado' });
                });

            }
        });

    });


});



app.post('/send-finishdelivery', function (req , res) {

    console.log('enviando al proveedior que su paquete finalizo: '+ req.body.to);
if (req.header('buu_auth')=== '12nakjsdbk1j2bkjasnasdbkasjndkasndkjwnqwjdhqkwjkjqwqwkqwkjd'){
    readHTMLFile(__dirname + '/views/Emailstemplates/deliveryentregado.html', function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            idtracking: req.body.idtrcking,
            entregadoa:  req.body.entregadoa,
            comentarios: req.body.comentarios,
            fechaentrega: req.body.fechaentrega,
            notas: req.body.notas,
            montocobrado: req.body.monto
        };
        var htmlToSend = template(replacements);
        let mailOptions = {
            from: 'notificaciones@buustores.com', // sender address
            to: req.body.to+ ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com' , // list of receivers
            subject: req.body.subject, // Subject line
            html: htmlToSend // html body
        };

        transporter.verify(function(error, success) {
            if (error) {
                console.log(error);
            } else {

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                    return ReS(res, {descripcion: 'Correo enviado' });
                });

            }
        });

    });
} else{

    ReS(res,{status:'No autorizado'},401);
}

    
    
    
    });
    

    app.post('/send-deliveryprogramado', function (req , res) {
        console.log('enviando al proveedor que su delivery esta programado' + req.body.to);
        console.log(req.header('buu_auth') );
        if (req.header('buu_auth') === '12nakjsdbk1j2bkjasnasdbkasjndkasndkjwnqwjdhqkwjkjqwqwkqwkjd'){
            console.log('Autorizado');
                        readHTMLFile(__dirname + '/views/Emailstemplates/deliveryprogramado.html', function(err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                idtracking: req.body.idtrcking,
                                fecharecoleccion:  req.body.fecharecoleccion,
                                para: req.body.para,
                                direccion: req.body.direccion,
                                cod: req.body.cod,
                                notas: req.body.notas
                            };
                            var htmlToSend = template(replacements);
                            let mailOptions = {
                                from: 'notificaciones@buustores.com', // sender address
                                to: req.body.to +', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
                                subject: req.body.subject, // Subject line
                                html: htmlToSend // html body
                            };
                    
                            transporter.verify(function(error, success) {
                                if (error) {
                                    console.log(error);
                                } else {
                    
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }
                                        console.log('Message %s sent: %s', info.messageId, info.response);
                                        return ReS(res, {descripcion: 'Correo enviado' });
                                    });
                    
                                }
                            });
                    
                        });
         } else  {
                        ReS(res,{status:'No autorizado'},401);
        }
        
        });
        



    app.post('/send-email', function (req, res) {



      let mailOptions = {
          from: 'notificaciones@buustores.com', // sender address
          to: req.body.to + ', cruz.juanjose@buustores.com, davidpalenciagt@hotmail.com, jr.orve@gmail.com', // list of receivers
          subject: req.body.subject, // Subject line
          text: req.body.text, // plain text body
          html: req.body.html // html body
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              return console.log(error);
          }
          console.log('Message %s sent: %s', info.messageId, info.response);
              res.render('index');
          });
      });








      app.post('/Authtwoway', function (req , res) {
          console.log('enviadno correo al cliente de 2 authenticate'+req.body.email );
            console.log(req.body);
        readHTMLFile(__dirname + '/views/Emailstemplates/authtwofactor.html', function(err, html) {
            var template = handlebars.compile(html);
            var replacements = {
                name: req.body.usuariobuu,
                newpass:  req.body.linkactivacion,
             
            };
            var htmlToSend = template(replacements);
            let mailOptions = {
                from: 'notificaciones@buustores.com', // sender address
                to: req.body.email, // list of receivers
                subject: req.body.subject, // Subject line
                html: htmlToSend // html body
            };
    
            transporter.verify(function(error, success) {
                if (error) {
                    console.log(error);
                } else {
    
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message %s sent: %s', info.messageId, info.response);
                        return ReS(res, {descripcion: 'Correo enviado' });
                    });
    
                }
            });
    
        });
    
    
    });
    
    function normalizePort(val) {
        const port = parseInt(val, 10);
      
        if (isNaN(port)) {
          // named pipe
          return val;
        }
      
        if (port >= 0) {
          // port number
          return port;
        }
      
        return false;
      }
      


          app.listen(port, function(){
            console.log('Server is running at port: ',port);
          });
