import { HStack, VStack } from "native-base";
import { Share } from 'react-native'
import { useRoute } from '@react-navigation/native';

import { Header } from "../components/Header";
import { Option } from "../components/Option";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { Guesses } from "../components/Guesses";
import { PoolPros } from "../components/PoolCard";
import { api } from "../services/api";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";


interface RouteParams {
  id: string;
}

export function Details() { 
  const [optionSelected, setOptionSelected] = useState<'guesses' | 'ranking'>('guesses');
  const [isLoading, setIsLoading] = useState(false);
  const [poolDetails, setPoolDetails] = useState<PoolPros[]>({} as PoolPros);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  async function fetchPoolDetails(){
    try{
      setIsLoading(true);
      const response = await api.get(`/pools/${id}`);
      setPoolDetails(response.data.pool);

    }catch (error){
      console.log(error);
    }finally{
      setIsLoading(false);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: poolDetails.code
    })
  }

  useEffect(() => {
    fetchPoolDetails()
  }, [])

  if(isLoading){
    return <Loading />
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header 
        title={poolDetails.title} 
        showBackButton 
        showShareButton
        onShare={handleCodeShare}
      />

      {
        poolDetails._count?.participants > 0 ? 
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />
          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option 
              title="Seus palpites" 
              isSelected={optionSelected === 'guesses'}
              onPress={() => setOptionSelected('guesses')}
            />
            <Option 
              title="Ranking do Grupo" 
              isSelected={optionSelected === 'ranking'}
              onPress={() => setOptionSelected('ranking')}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack> 
        : <EmptyMyPoolList code={poolDetails.code} />
      }
    </VStack>
  )
}