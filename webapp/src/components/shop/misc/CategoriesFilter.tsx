import {
  Stack,
  FormControl,
  InputLabel,
  MenuItem,
  SelectChangeEvent,
  ListItemIcon,
  Select,
} from "@mui/material";

import CheckroomIcon from "@mui/icons-material/Checkroom";
import ChairIcon from "@mui/icons-material/Chair";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type CategoriesFilterProps = {
  categoryFilter: string;
  categoryClothes: string;
  categoryDecoration: string;
  categoryElectronics: string;
  categoryMiscellaneous: string;
  handleChange: (event: SelectChangeEvent) => void;
};

export function CategoriesFilter(props: CategoriesFilterProps) {
  return (
    <FormControl variant="standard" sx={{ width: "100%" }} size="small">
      <InputLabel id="select-categories">Filter by category...</InputLabel>
      <Select
        labelId="select-categories"
        id="select-categories"
        value={props.categoryFilter}
        onChange={props.handleChange}
        label="categories"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={props.categoryClothes}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              <CheckroomIcon color="primary" fontSize="small" />
            </ListItemIcon>
            {props.categoryClothes}
          </Stack>
        </MenuItem>
        <MenuItem value={props.categoryDecoration}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              <ChairIcon color="primary" fontSize="small" />
            </ListItemIcon>
            {props.categoryDecoration}
          </Stack>
        </MenuItem>
        <MenuItem value={props.categoryElectronics}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              <PhoneAndroidIcon color="primary" fontSize="small" />
            </ListItemIcon>
            {props.categoryElectronics}
          </Stack>
        </MenuItem>
        <MenuItem value={props.categoryMiscellaneous}>
          <Stack direction="row" alignItems="center">
            <ListItemIcon>
              <AutoAwesomeIcon color="primary" fontSize="small" />
            </ListItemIcon>
            {props.categoryMiscellaneous}
          </Stack>
        </MenuItem>
      </Select>
    </FormControl>
  );
}
