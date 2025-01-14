import {useNavigate, useSearchParams} from '@remix-run/react';
import {useState, useRef, useEffect} from 'react';
import {useTranslation} from '~/hooks/useTranslation';

export function ProductDuoOptions({option, optionIndex, onChangeHandler}) {
  const {t} = useTranslation();

  return (
    <>
      <select 
        name={`select-value-${option.name}-${optionIndex}`} 
        data-option-index={optionIndex} 
        data-option-name={option.name} 
        onChange={onChangeHandler}
      >
        {option.optionValues.map((value, index) => {
          return (
            <option 
              key={`option-${index}`} 
              value={value?.name}
            >
              {value?.name}
            </option>
          )           
        })}
      </select>
    </>
  );
}