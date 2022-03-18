import Grid from "@mui/material/Grid";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

export default function WebIdRadioGroup(props: any) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue((event.target as HTMLInputElement).value);
  };

  return (
    <Grid item xs={12}>
      <FormControl>
        <RadioGroup value={props.value} onChange={handleChange}>
          {props.radioItems.map((radioItem: string) => (
            <FormControlLabel
              control={
                <Radio icon={props.icon} checkedIcon={props.checkedIcon} />
              }
              value={radioItem}
              label={radioItem}
              key={radioItem}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Grid>
  );
}
