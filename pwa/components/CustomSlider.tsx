// components/CustomSlider.tsx
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Definição das propriedades do CustomSlider
interface CustomSliderProps extends Settings {
  children: React.ReactNode;
}

// Definição da interface para os métodos expostos
interface SliderHandle {
  slickGoTo: (index: number) => void;
}

const CustomSlider = forwardRef<SliderHandle, CustomSliderProps>(
  (props, ref) => {
    const sliderRef = useRef<Slider>(null);

    useImperativeHandle(ref, () => ({
      slickGoTo: (index: number) => {
        if (sliderRef.current) {
          sliderRef.current.slickGoTo(index);
        }
      },
    }));

    const settings = {
      dots: true,
      infinite: true,
    };

    return (
      <div className="slider-container">
        <Slider ref={sliderRef} {...props} {...settings}>
          {props.children}
        </Slider>
      </div>
    );
  }
);

// Definindo displayName para o componente CustomSlider
CustomSlider.displayName = "CustomSlider";

export default CustomSlider;
