import {
  Stack,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  MenuItem,
  ListItemIcon,
  Select,
} from "@mui/material";

import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

type ProductsFilterProps = {
  sortMode: string;
  priceAscending: string;
  priceDescending: string;
  handleChange: (event: SelectChangeEvent) => void;
};

export function SortProducts(props: ProductsFilterProps) {
  return (
    <FormControl variant="standard" sx={{ width: "100%" }} size="small">
      <InputLabel id="select-order-status">Sort by price...</InputLabel>
      <Select
        labelId="select-product"
        id="select-product"
        value={props.sortMode}
        onChange={props.handleChange}
        label="filter"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={props.priceAscending}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              <ArrowUpwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            Lower to higher
          </Stack>
        </MenuItem>
        <MenuItem value={props.priceDescending}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              <ArrowDownwardIcon color="primary" fontSize="small" />
            </ListItemIcon>
            Higher to lower
          </Stack>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
