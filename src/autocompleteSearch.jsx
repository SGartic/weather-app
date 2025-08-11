import React, { useState } from 'react'
import { GeoapifyGeocoderAutocomplete, GeoapifyContext } from '@geoapify/react-geocoder-autocomplete'
import '@geoapify/geocoder-autocomplete/styles/minimal.css'

const autoCompleteSearch = () => {

    const VITE_GEOAPIFY_API = import.meta.env.VITE_GEOAPIFY_API;

  function onPlaceSelect(value) {
    console.log(value);
  }

  function onSuggectionChange(value) {
    console.log(value);
  }

  return <GeoapifyContext apiKey={VITE_GEOAPIFY_API}>
    <GeoapifyGeocoderAutocomplete
      placeSelect={onPlaceSelect}
      suggestionsChange={onSuggectionChange}
    />
  </GeoapifyContext>
}

export default autoCompleteSearch