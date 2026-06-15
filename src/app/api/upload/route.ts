import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { getCurrentUser } from "@/lib/auth";

export const runtime = "nodejs";

type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

function validarVariaveisCloudinary() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

async function uploadBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<CloudinaryUploadResult>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "roteirize-pb/pontos-turisticos",
        resource_type: "image",
        transformation: [
          {
            width: 1600,
            height: 1000,
            crop: "limit",
            quality: "auto:good",
          },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Upload não retornou resultado."));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );

    stream.end(buffer);
  });
}

export async function POST(request: Request) {
  try {
    const usuario = await getCurrentUser();

    if (!usuario || (usuario.role !== "PARTNER" && usuario.role !== "ADMIN")) {
      return NextResponse.json(
        {
          error: "Você precisa estar logado como parceiro ou administrador.",
        },
        {
          status: 401,
        }
      );
    }

    if (!validarVariaveisCloudinary()) {
      return NextResponse.json(
        {
          error:
            "Cloudinary não configurado. Confira CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY e CLOUDINARY_API_SECRET no .env.",
        },
        {
          status: 500,
        }
      );
    }

    const formData = await request.formData();
    const arquivo = formData.get("file");

    if (!(arquivo instanceof File)) {
      return NextResponse.json(
        {
          error: "Envie um arquivo de imagem no campo file.",
        },
        {
          status: 400,
        }
      );
    }

    if (!arquivo.type.startsWith("image/")) {
      return NextResponse.json(
        {
          error: "O arquivo enviado precisa ser uma imagem.",
        },
        {
          status: 400,
        }
      );
    }

    const tamanhoMaximoMb = 8;
    const tamanhoMaximoBytes = tamanhoMaximoMb * 1024 * 1024;

    if (arquivo.size > tamanhoMaximoBytes) {
      return NextResponse.json(
        {
          error: `A imagem deve ter no máximo ${tamanhoMaximoMb} MB.`,
        },
        {
          status: 400,
        }
      );
    }

    const resultado = await uploadBuffer(arquivo);

    return NextResponse.json({
      url: resultado.secure_url,
      publicId: resultado.public_id,
    });
  } catch (error) {
    console.error("Erro no upload para Cloudinary:", error);

    return NextResponse.json(
      {
        error: "Erro ao enviar imagem para o Cloudinary.",
      },
      {
        status: 500,
      }
    );
  }
}
