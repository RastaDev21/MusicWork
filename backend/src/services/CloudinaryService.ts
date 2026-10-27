import cloudinary from "../config/cloudinary";

type ResourceType = "image" | "video";

// Pastas usadas pelo uploadMiddleware, separadas pelo resource_type do
// Cloudinary (áudio entra como "video"). Se o uploadMiddleware ganhar uma
// pasta nova, ela precisa entrar aqui também, senão a exclusão de conta
// não limpa os arquivos dela.
export const CLOUDINARY_FOLDERS: Record<ResourceType, string[]> = {
  image: [
    "musicwork/covers",
    "musicwork/avatars",
    "musicwork/post-images",
    "musicwork/show-flyers",
    "musicwork/message-images",
  ],
  video: [
    "musicwork/presentation-videos",
    "musicwork/post-videos",
    "musicwork/message-videos",
    "musicwork/profile-audio",
  ],
};

// O erro do SDK do Cloudinary carrega `request_options.auth` com a API key
// e o secret — nunca logar o objeto inteiro, só mensagem e código HTTP.
function describeCloudinaryError(error: any) {
  const message = error?.error?.message || error?.message || "erro desconhecido";
  const httpCode = error?.error?.http_code || error?.http_code;
  return httpCode ? `${message} (HTTP ${httpCode})` : message;
}

// Apaga um arquivo do Cloudinary. Nunca lança erro — se falhar
// (ex: já tinha sido apagado, ID errado), só loga e segue, pra nunca
// travar o upload da foto nova por causa da limpeza da antiga.
export async function deleteCloudinaryFile(
  publicId: string | null | undefined,
  resourceType: ResourceType = "image",
) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error(
      `Erro ao apagar arquivo órfão do Cloudinary (${publicId}):`,
      describeCloudinaryError(error),
    );
  }
}

// Extrai public_id e resource_type de uma URL do Cloudinary, ex:
// https://res.cloudinary.com/<cloud>/image/upload/v123/musicwork/avatars/<id>.jpg
// Retorna null pra URLs que não são do Cloudinary (ex: /uploads/... antigos).
export function publicIdFromUrl(
  url: string | null | undefined,
): { publicId: string; resourceType: ResourceType } | null {
  if (!url) return null;
  const match = url.match(
    /res\.cloudinary\.com\/[^/]+\/(image|video)\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-z0-9]+)?$/i,
  );
  if (!match) return null;
  return {
    resourceType: match[1].toLowerCase() as ResourceType,
    publicId: match[2],
  };
}

// Apaga toda a mídia de um usuário que está sendo excluído, em duas passadas:
// 1. Pelas URLs informadas (pega uploads antigos sem o userId no public_id e
//    mídia de terceiros em conversas apagadas junto).
// 2. Pelo prefixo "<pasta>/<userId>-" (pega órfãos: fotos trocadas antes de
//    existir avatarPublicId, áudio/vídeo substituídos, upload de post que
//    nunca foi publicado). Funciona porque o uploadMiddleware sempre gera
//    public_id = `${userId}-${Date.now()}`.
// As chamadas rodam uma por vez: em paralelo, a Admin API recusa com
// "Too many concurrent admin_api_resource_destroy operations" (HTTP 420).
// Nunca lança erro — falhas só são logadas.
export async function deleteUserMedia(
  userId: string,
  urls: (string | null | undefined)[],
) {
  const idsByType: Record<ResourceType, Set<string>> = {
    image: new Set(),
    video: new Set(),
  };
  for (const url of urls) {
    const parsed = publicIdFromUrl(url);
    if (parsed) idsByType[parsed.resourceType].add(parsed.publicId);
  }

  async function run(description: string, task: () => Promise<unknown>) {
    try {
      await task();
    } catch (error) {
      console.error(
        `Erro ao apagar mídia do usuário ${userId} no Cloudinary (${description}):`,
        describeCloudinaryError(error),
      );
    }
  }

  for (const resourceType of ["image", "video"] as ResourceType[]) {
    const ids = [...idsByType[resourceType]];
    // A Admin API aceita no máximo 100 public_ids por chamada.
    for (let i = 0; i < ids.length; i += 100) {
      const batch = ids.slice(i, i + 100);
      await run(`${batch.length} arquivos ${resourceType}`, () =>
        cloudinary.api.delete_resources(batch, { resource_type: resourceType }),
      );
    }

    for (const folder of CLOUDINARY_FOLDERS[resourceType]) {
      const prefix = `${folder}/${userId}-`;
      await run(`prefixo ${prefix}`, () =>
        cloudinary.api.delete_resources_by_prefix(prefix, {
          resource_type: resourceType,
        }),
      );
    }
  }
}
