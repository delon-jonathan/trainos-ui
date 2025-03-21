import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Box from '@mui/material/Box';

interface CompaniesFiltersProps {
  onSearch: () => void;
  setSearchTypeUser:(value: string) => void;
  setSearchParam: (value: string) => void;
}

export function CompaniesFilters({ onSearch, setSearchTypeUser, setSearchParam }: CompaniesFiltersProps): React.JSX.Element {
	
  const handleSearch = () => {
    onSearch();
  };
	
   return (
    <Card sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <OutlinedInput
          onChange={(e) => setSearchParam(e.target.value)}
          fullWidth
          placeholder="Search user"
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={{ maxWidth: '500px' }}
        />
        <FormControl component="fieldset" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <FormLabel component="legend" sx={{ mr: 2 }}>Search by</FormLabel>
          <RadioGroup row onChange={(e) => setSearchTypeUser(e.target.value)}>
            <FormControlLabel value="BY_USERNAME" control={<Radio />} label="Username" />
            <FormControlLabel value="BY_NAME" control={<Radio />} label="Name" />
          </RadioGroup>
        </FormControl>
        <Box sx={{ flexGrow: 1 }} />
        <Button onClick={handleSearch} variant="contained" sx={{ p: 2 }}>
          Search
        </Button>
      </Box>
    </Card>
  );
}