import Image from "next/image";

interface Props {
  src: string;
  alt: string;
}

const MusicSlide = (props: Props) => {
  const { src, alt } = props;
  // return <img src={src} alt={alt} height={"98%"} />;
  return <Image src={src} alt={alt} width={1920} height={1080} />;
};

export default MusicSlide;
