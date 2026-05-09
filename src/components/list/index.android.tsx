import React from 'react';
import { FlatList } from 'react-native';
import { Card } from '../card';
import { styles } from "./styles";

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
    <FlatList
      data={data}
      keyExtractor={(item) => String(item.id)}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <Card style={styles.cardMargin}>
          {renderItemContent(item)}
        </Card>
      )}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.2}
      contentContainerStyle={styles.container}
    />
  );
}

