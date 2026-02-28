import { Storage, Bucket, File } from "@google-cloud/storage";
import { faker } from "@faker-js/faker";
import serviceAccount from "@/service-account.json";
import fs from "fs";

async function getFileNames() {
    const storage = new Storage({
        projectId: "brainpro-487522",
        credentials: serviceAccount,
    });

    console.log("Getting buckets");
    const bucketResp = await storage.getBuckets();
    const bucket: Bucket = bucketResp[0][0];
    console.log("Got bucket");
    const files: File[] = (await bucket.getFiles())[0];
    return files.map((f) => f.name);
}

function getShortName() {
    let fullName = faker.person.firstName() + " " + faker.person.lastName();
    while (fullName.split(" ").length !== 2 || fullName.includes("-")) {
        console.log("anem was", fullName);
        fullName = faker.person.firstName() + " " + faker.person.lastName();
    }
    return fullName.replaceAll("'", "''");
}

function mapToInsertStatement(fileNames: string[]) {
    const start = `DELETE FROM public.game_answer WHERE true;\nDELETE FROM public.game_session WHERE true;\nDELETE FROM public.face WHERE true;\nINSERT INTO public.face (file_path, name) VALUES\n`;
    const valueStrings = fileNames.map((f) => {
        return `('${f}', '${getShortName()}')`;
    });
    return start.concat(valueStrings.join(",\n"));
}

const fileNames = await getFileNames();
console.log("file Names", fileNames);
const insertStatement = mapToInsertStatement(fileNames);

fs.writeFileSync(
    "supabase/migrations/20260225030505_insert_face_names_2.sql",
    insertStatement,
);
