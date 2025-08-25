import ConsumerService from "../services/ConsumerService.js";
import Mailer from "../helper/Mailer.js";

const queue = "email";
const consumerService = new ConsumerService();
const init = async() => {
    await consumerService.listen(queue, async (message) => {
        if( !message.content ) return;

        try {
            const data = JSON.parse(message.content.toString());

            const mailer = new Mailer();
            mailer.setSubject(`Playlist ${data.name}`);
            mailer.setContent(`Playlist ${data.name} has been exported to ${data.email}`);
            mailer.setRecipient(data.email);
            await mailer.send();
        } catch (error) {
            console.log("Error while sending email: ", error.message);

            await consumerService.setQueue();
        }
    });
};

try { await init(); } catch (error) { console.log("There is an error:"); }