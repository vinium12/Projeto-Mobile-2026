import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

interface ListProps {
  data: any[];
  onLoadMore: () => void;
  renderItemContent: (item: any) => React.ReactNode;
  numColumns?: number;
}

export function List({ 
  data, 
  onLoadMore, 
  renderItemContent,
  numColumns = 1,
}: ListProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.grid, { }]}>
        {data.map((item) => (
          <View key={String(item.id)} style={[styles.cell, { width: `${100 / numColumns}%` }]}>
            {renderItemContent(item)}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    padding: 6,
  },
});