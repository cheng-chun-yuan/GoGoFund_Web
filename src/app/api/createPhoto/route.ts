import { type NextRequest, NextResponse } from 'next/server';


import { z } from 'zod';

import OpenAI from "openai";
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});
function metadata(
    image: string,
    dogename: string,
    breed: string,
    color: string,
  ) {
    return {
      description: dogename + " is an AI-crafted, vibrant cartoonish dog. With its bright " + color + " fur and exaggerated, joyful features, it captures the whimsical essence of the " + breed + " breed.",
      external_url: "",
      image: image,
      name: dogename,
      attributes: [
        { trait_type: "Color", value: color },
        { trait_type: "Breed", value: breed },
      ],
    };
  }
const generateImageSchema = z.object({
    userGender: z.string(),
    userAge: z.number(),
    dogeAge: z.number(),
    dogeGender: z.string(),
    dogeBreed: z.string(),
    dogeColor: z.string(),
    dogeName: z.string(),
});


type generateImageRequest = z.infer<typeof generateImageSchema>;


export async function POST(req: NextRequest) {
    // Log to see if the function is triggered
    console.log("request to generate an image variation");

    // Parse the JSON body from the request

    const data = await req.json();
    // Validate the request body
    try {
        // parse will throw an error if the data doesn't match the schema
        generateImageSchema.parse(data);
    } catch (error) {
        // in case of an error, we return a 400 response
        if (error instanceof z.ZodError) {
            console.error(error.errors);
        } else {
            console.error(error);
        }
        return NextResponse.json({ error: "Invalid Zod request" }, { status: 400 });
    }
    const { userGender, userAge, dogeAge, dogeGender, dogeName, dogeBreed, dogeColor } = data as generateImageRequest;
    console.log(userGender, userAge, dogeAge, dogeName, dogeGender, dogeBreed, dogeColor);
    try {
        // Generate an prompt based on the request body
        const prompt = `Create a vibrant, cartoonish full-body image of a ${dogeGender} ${dogeBreed} dog whose name is ${dogeName}, ${dogeAge} years old, with a ${dogeColor} coat, standing and facing forward with a joyful and friendly expression. The dog should be perfectly centered in the frame against a solid, neutral-colored background, ensuring that the entire body of the dog is visible from head to tail. The design should be simple yet expressive, highlighting the distinctive features of the Shiba Inu breed, such as its plush fur, curled tail, and alert ears. The posture should convey a sense of happiness and approachability, with the dog looking directly at the viewer. The image should maintain a minimalist aesthetic to focus attention on the dog, making it easily recognizable and suitable for a wide range of applications. User's gender: ${userGender}, user's age: ${userAge}.`;
        console.log(prompt);
        // // Assuming 'data' contains necessary information for image variation
        // // Since this example is for a generic POST request, adjust 'image' parameter based on your actual data structure
        // // Here 'data.image' should contain the base64 encoded image or similar identifier
        const imageResponse = await openai.images.generate({
            prompt: prompt,
            model: "dall-e-3",
            n: 1,
            size: "1024x1024",
        });

        const image = imageResponse.data[0] ;
        // const image = {
        //     revised_prompt: "Generate an image with a vivid, cartoon-like depiction of a 5-year-old male Shiba Inu dog. The dog should have a yellow coat, be standing upright, facing forward, and expressing joy and friendliness. The dog should be the center of the frame against a neutral background, with every part of its body visible from its head to its curled tail. Highlight the characteristic features of the Shiba Inu breed, such as its plush fur, curled tail, and alert ears. Convey an aura of happiness and openness with the dog's posture, looking directly at the viewer. Design the image with a minimalist aesthetic, focusing viewer's attention on the dog, making him easily identifiable and suitable for a wide range of applications.",
        //     url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-foDXZcbMLiZaQKxF9k0MAp5x/user-izhf3u7dtd0zXd1ot5Xk6OmO/img-9yoLvAgrXZgy3MfCCCc5PhgL.png?st=2024-03-02T11%3A26%3A58Z&se=2024-03-02T13%3A26%3A58Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-01T16%3A12%3A23Z&ske=2024-03-02T16%3A12%3A23Z&sks=b&skv=2021-08-06&sig=mF5T826vrWHHxObVo8MQV8jBCSfY3mHEjQlvChZZ5dI%3D'
        //   };
        const formData = new FormData();
        if (!image.url) {
            return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
        }
        const metadataResponse = new File([
              JSON.stringify(
                metadata(image.url, dogeName, dogeBreed, dogeColor),
                ),
            ],
            "metadata.json",
            {
              type: "application/json",
            },
        );
        formData.append("file", metadataResponse);
        const response = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${process.env.PINATA_JWT}`,
              },
              body: formData,
            },
          );
          const { IpfsHash } = await response.json();
        // Return the image variation response
        return NextResponse.json({ ipfsHash: IpfsHash }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to generate image " }, { status: 500 });
    }
}
