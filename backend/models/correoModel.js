const { application } = require('express');
const express = require("express");
const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });


/**
 * Envía un correo electrónico utilizando el servicio de Gmail a través de Nodemailer.
 * 
 * @param {Object} req - El objeto de solicitud (Request).
 * @param {Object} res - El objeto de respuesta (Response).
 * @returns {void}
 * 
 * @precondición {req.body} Debe contener los campos `para`, `por` y `texto` con información válida.
 * @precondición Las variables de entorno `EMAIL_USER` y `EMAIL_PASS` deben estar configuradas correctamente.
 * @postcondición Si los datos son válidos y no ocurre ningún error, se envía un correo electrónico y se retorna un mensaje de éxito.
 * @postcondición En caso de error, se devuelve el código y mensaje de error correspondiente.
 */
const enviarCorreo = (req, res) => {

    // Configurar el transporter de Nodemailer
    const transporte = nodemailer.createTransport({
        host: "smtp.gmail.com",
        //service: "gmail",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Ruta para enviar el correo
    app.post("/send-email", async (req, res) => {
        const { para, por, texto } = req.body;

        if (!para || !por || !texto) {
            return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }

        const mailDetalles = {
            from: process.env.EMAIL_USER,
            to: para,
            subject: por,
            text: texto,
        };

        try {
            await transporte.sendMail(mailDetalles);
            res.status(200).json({ message: "Correo enviado con éxito" });
        } catch (error) {
            console.error("Error al enviar el correo:", error);
            res.status(500).json({ error: "Error al enviar el correo" });
        }
    });
};




module.exports = {enviarCorreo};