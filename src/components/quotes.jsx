// src/components/Quote.jsx
import React, { useEffect, useState } from 'react';
import './quotes.css';
import Spinner from './spinner';
import { fetchData } from '../services/api.service';

const Quote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const data = await fetchData("quotes/random");
        setQuote(data);
      } catch (err) {
        console.error('Error fetching quote:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuote();
  }, []);

  // useEffect(() => {
  //   fetchQuote();

  //   const intervalId = setInterval(() => {
  //     fetchQuote();
  //   }, 15000);

  //   return () => clearInterval(intervalId); 
  // }, [fetchQuote]);

  return (
    <div className="quote-container">
      {loading ? (
        <Spinner />
      ) : (
        <>
          <p className="quote-text">“{quote.quote}”</p>
          <p className="quote-author">— {quote.author}</p>
        </>
      )}
    </div>
  );
};

export default Quote;
