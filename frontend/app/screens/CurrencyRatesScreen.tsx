import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Text, Card, ActivityIndicator } from 'react-native-paper';
import CountryFlag from 'react-native-country-flag';

const COUNTRY_MAP: Record<string, string> = {
  USD: 'US',
  EUR: 'EU',
  GBP: 'GB',
  PLN: 'PL',
  CHF: 'CH',
  CAD: 'CA',
  JPY: 'JP',
  CZK: 'CZ',
  SEK: 'SE',
  NOK: 'NO',
  HUF: 'HU',
  TRY: 'TR',
  AUD: 'AU',
  DKK: 'DK',
  CNY: 'CN',
  KZT: 'KZ',
  MXN: 'MX',
  INR: 'IN',
  ZAR: 'ZA',
  SGD: 'SG',
  KRW: 'KR',
  BGN: 'BG',
  RON: 'RO',
  THB: 'TH',
  HKD: 'HK',
};

const DISPLAY_CODES = Object.keys(COUNTRY_MAP);

const POPULAR_CODES = ['USD', 'EUR', 'GBP', 'PLN', 'CHF', 'CAD', 'JPY'];

export default function CurrencyRatesScreen() {
  const [rates, setRates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter((item: any) => DISPLAY_CODES.includes(item.cc));

        filtered.sort((a: any, b: any) => {
          const aIndex = POPULAR_CODES.indexOf(a.cc);
          const bIndex = POPULAR_CODES.indexOf(b.cc);
          if (aIndex === -1 && bIndex === -1) return a.cc.localeCompare(b.cc);
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });

        setRates(filtered);
      })
      .catch(() => setRates([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Currency Rates" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator animating />
        ) : (
          rates.map(rate => (
            <Card key={rate.cc} style={styles.card}>
              <Card.Content style={styles.cardContent}>
                <CountryFlag isoCode={COUNTRY_MAP[rate.cc] || 'UN'} size={25} />
                <View style={{ marginLeft: 16 }}>
                  <Text style={styles.code}>{rate.cc}</Text>
                  <Text style={styles.rate}>{rate.rate.toFixed(2)} UAH</Text>
                </View>
              </Card.Content>
            </Card>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: { backgroundColor: '#fff', elevation: 2 },
  headerTitle: { color: '#333', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 24, paddingBottom: 36 },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rate: {
    fontSize: 14,
    color: '#666',
  },
});
