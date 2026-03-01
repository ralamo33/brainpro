import { Storage, Bucket, File } from "@google-cloud/storage";
import serviceAccount from "@/service-account";
import fs from "fs";
import { Faker, pl, cs_CZ, hu } from "@faker-js/faker";
import anyAscii from "any-ascii";

async function getFileNames() {
    const storage = new Storage({
        projectId: process.env.GOOGLE_PROJECT_ID,
        credentials: serviceAccount,
    });

    const bucketResp = await storage.getBuckets();
    const bucket: Bucket = bucketResp[0][0];
    const files: File[] = (await bucket.getFiles())[0];
    return files.map((f) => f.name);
}

function getShortName() {
    const faker = new Faker({ locale: [pl, cs_CZ, hu] });

    let name = faker.person.firstName() + " " + faker.person.lastName();
    name = anyAscii(name);
    while (name.split(" ").length !== 2 || name.includes("-")) {
        name = faker.person.firstName() + " " + faker.person.lastName();
    }
    return name.replaceAll("'", "''");
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
    "supabase/migrations/20260301002056_insert_face_names_3.sql",
    insertStatement,
);
