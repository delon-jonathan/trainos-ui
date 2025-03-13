import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Button from '@mui/material/Button';

interface CompaniesFiltersProps {
  onSearch: () => void;
  searchTypeUser?:string;
  searchParam?:string
}

export function CompaniesFilters({ onSearch, searchTypeUser, searchParam }: CompaniesFiltersProps): React.JSX.Element {
	
  const handleSearch = () => {
	console.log("betlog");
    onSearch();
  };
	
  return (
    <Card sx={{ p: 2 }}>
      <OutlinedInput
        defaultValue=""
        fullWidth
        placeholder="Search user"
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px', marginRight: 5 }} // Adds margin between input and button
      />
      <Button  onClick={handleSearch} variant="contained" sx={{ p: 2 }}>
        Search
      </Button>
    </Card>
  );
}