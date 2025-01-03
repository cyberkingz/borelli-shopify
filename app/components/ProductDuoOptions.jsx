import {useNavigate, useSearchParams} from '@remix-run/react';
import {useState, useRef, useEffect} from 'react';;

export function ProductDuoOptions({option, optionIndex, onChangeHandler}) {
  return (
    <>
        <select name={`select-value-${option.name}-${optionIndex}`} data-option-index={optionIndex} data-option-name={option.name} onChange={() => onChangeHandler(event)}>
          {option.optionValues.map((value,index) => {
            return (
              <option key={`option-${index}`} value={value?.name}>{value?.name}</option>
            )           
          })}
        </select>
    </>
  )
}