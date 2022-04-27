import * as React from "react";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import ShareIcon from "@mui/icons-material/Share";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import StarIcon from "@mui/icons-material/Star";

type ProductSpeedDialProps = {
  addToCart: Function;
  review: Function;
  share: Function;
};

export default function ProductSpeedDial(props: ProductSpeedDialProps) {
  // We manage the review dialog

  const actions = [
    {
      icon: <AddShoppingCartIcon />,
      name: "Add to Shopping Cart",
      play: props.addToCart,
    },
    { icon: <StarIcon />, name: "Review item", play: props.review },
    { icon: <ShareIcon />, name: "Share", play: props.share },
  ];

  return (
    <SpeedDial
      ariaLabel="SpeedDial basic example"
      sx={{ position: "fixed", bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={(e) => {
            action.play();
          }}
        />
      ))}
    </SpeedDial>
  );
}
