// src/components/Quote.jsx
import React, { useEffect, useState, useCallback } from 'react';
import './quotes.css';
import Spinner from './spinner';

const Quote = () => {
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuote = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('https://dummyjson.com/quotes/random');
      const data = await res.json();
      setQuote(data);
    } catch (err) {
      console.error('Error fetching quote:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote();

    const intervalId = setInterval(() => {
      fetchQuote();
    }, 15000);

    return () => clearInterval(intervalId); 
  }, [fetchQuote]);

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
