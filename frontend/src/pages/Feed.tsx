import { Box } from "@mui/material";
import Layout from "../components/Layout/Layout";
import PostCard from "../components/PostCard/PostCard";
import NewPost from "../components/NewPost/NewPost";

const mockPosts = [
  {
    id: 1,
    name: "Rafael Souza",
    instrument: "Baixista",
    secondaryProfession: "Designer Gráfico",
    city: "Santos",
    time: "2h atrás",
    content:
      "Procuro guitarrista para projeto de reggae em Santos. Ensaios aos sábados. Manda mensagem!",
    likes: 12,
    comments: 4,
  },
  {
    id: 2,
    name: "Marina Lima",
    instrument: "Vocalista",
    secondaryProfession: "Fotógrafa",
    city: "São Paulo",
    time: "5h atrás",
    content:
      "Faço ensaios fotográficos para músicos e bandas! Portfólio no link da bio. Preços especiais para a galera do MusicWork 🎵",
    likes: 28,
    comments: 9,
  },
  {
    id: 3,
    name: "Carlos Drummond",
    instrument: "Guitarrista",
    secondaryProfession: "Desenvolvedor",
    city: "Campinas",
    time: "8h atrás",
    content:
      "Acabei de lançar meu primeiro EP instrumental! Muito trabalho e dedicação. Disponível em todas as plataformas 🎸",
    likes: 45,
    comments: 17,
  },
];

export default function Feed() {
  return (
    <Layout>
      <Box sx={{ maxWidth: 600, mx: "auto", p: 2 }}>
        <NewPost />
        {mockPosts.map(post => (
          <PostCard key={post.id} {...post} />
        ))}
      </Box>
    </Layout>
  );
}
