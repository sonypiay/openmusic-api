import { existsSync, createReadStream, unlinkSync } from "node:fs";

import ConsumerService from "../services/ConsumerService.js";
import Mailer from "../helper/Mailer.js";
import ProducerService from "../services/ProducerService.js";
import Logging from "../application/Logging.js";

const queue = "email";
const consumerService = new ConsumerService();

const init = async() => {
    try {
        await consumerService.listen(queue, async (message) => {
            if( ! message ) return;

            const headers = message.properties.headers;
            const data = JSON.parse(message.content.toString());
            let retryCount = headers['x-retry-count'] ?? 0;

            if( ! existsSync(`./export/${data.file}`) ) {
                Logging.error(`File ${data.file} not found!`);
                return;
            }

            try {
                const mailer = new Mailer();
                const emailContent = `<p>Halo <strong>${data.email}</strong>,</p> <p>Playlist <strong>${data.name}</strong> telah diexport ke email anda.</p>`;

                mailer.setSubject(`Playlist ${data.name}`);
                mailer.setContent(emailContent);
                mailer.setRecipient(data.email);
                mailer.setAttachments({
                    filename: data.file,
                    content: createReadStream(`./export/${data.file}`),
                });

                await mailer.send();
                unlinkSync(`./export/${data.file}`);
            } catch (error) {
                console.error(`There was an error while sending email: ${error.message}`);
                const producerService = new ProducerService();

                if( retryCount < 3 ) {
                    console.info(`Retrying to send email to ${data.email}`);
                    setTimeout(async() => {
                        producerService.setMessage(JSON.stringify(data), {
                            'x-retry-count': retryCount
                        });
                        await producerService.send(queue);
                    }, 2000);

                    retryCount++;
                } else {
                    console.error(`Failed to send email to ${data.email} after 3 retries`);
                    producerService.setQueueOptions({
                        durable: true,
                        arguments: {
                            'x-queue-type': 'quorum',
                        },
                    });
                    producerService.setMessage(JSON.stringify(data), {
                        'x-queue-from': queue,
                    });
                    await producerService.send('dlq');
                }
            }
        });
    } catch(error) {
        console.error(`Failed to start email listener: ${error.message}`);
        console.info(`Retrying in 5 seconds...`);
        setTimeout(await init, 5000);
    }
};

await init();