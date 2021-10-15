import * as admin from "firebase-admin";

process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
process.env.FIREBASE_FIRESTORE_EMULATOR_ADDRESS = "localhost:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

admin.initializeApp({
  projectId: "extensions-testing",
});

const mail = "mail";
const mailCollection = admin.firestore().collection(mail);

const templates = "templates";
const templatesCollection = admin.firestore().collection(templates);

describe("e2e testing", () => {
  test("the SMTP function is working", async (): Promise<void> => {
    const record = {
      to: "test-assertion@email.com",
      message: {
        subject: "test",
      },
    };

    const doc = await mailCollection.add(record);

    return new Promise((resolve, reject) => {
      const unsubscribe = doc.onSnapshot((snapshot) => {
        const document = snapshot.data();

        if (document.delivery && document.delivery.info) {
          expect(document.delivery.info.accepted[0]).toEqual(record.to);
          expect(document.delivery.info.response).toContain("250 Accepted");
          unsubscribe();
          resolve();
        }
      });
    });
  }, 8000);
});
