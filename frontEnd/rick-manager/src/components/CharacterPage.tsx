import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Search, Heart, LogOut, SortAsc, SortDesc } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import { Character, CharacterQueryParams } from '../types';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { CharacterCard } from '../components/CharacterCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import toast from 'react-hot-toast';

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const Header = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #333;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const WelcomeText = styled.span`
  color: #666;
`;

const Content = styled.div`
  padding: 24px;
`;

const FiltersCard = styled(Card)`
  margin-bottom: 24px;
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
`;

const Select = styled.select`
  padding: 12px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  
  &:focus {
    border-color: #667eea;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
`;

const SortControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SortLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
`;

const SortButton = styled.button`
  background: none;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  
  &:hover {
    border-color: #667eea;
  }
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px;
  color: #666;
  
  h3 {
    margin-bottom: 8px;
  }
`;

export const CharactersPage: React.FC = () => {
  const { user, logout } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadCharacters = useCallback(async () => {
    setLoading(true);
    try {
      const params: CharacterQueryParams = {
        page: currentPage,
        name: searchTerm || undefined,
        status: statusFilter as any || undefined,
        species: speciesFilter || undefined,
        gender: genderFilter as any || undefined,
        sortBy,
        sortOrder,
        filter: showFavoritesOnly ? 'favorites' : undefined
      };
      
      const response = await api.getCharacters(params);
      setCharacters(response.results);
    } catch (error: any) {
      toast.error('Failed to load characters');
      console.error('Failed to load characters:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, statusFilter, speciesFilter, genderFilter, sortBy, sortOrder, showFavoritesOnly]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  const handleToggleFavorite = async (characterId: number) => {
    const character = characters.find(c => c.id === characterId);
    if (!character) return;

    try {
      if (character.isFavorite) {
        await api.removeFromFavorites(characterId);
        toast.success('Removed from favorites');
      } else {
        await api.addToFavorites(characterId);
        toast.success('Added to favorites');
      }
      
      setCharacters(prev => 
        prev.map(c => 
          c.id === characterId 
            ? { ...c, isFavorite: !c.isFavorite }
            : c
        )
      );
    } catch (error: any) {
      toast.error('Failed to update favorite');
      console.error('Failed to toggle favorite:', error);
    }
  };

  const filteredCharacters = characters.filter(character => {
    if (showFavoritesOnly && !character.isFavorite) return false;
    return true;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <PageContainer>
      <Header>
        <HeaderTitle>Rick & Morty Characters</HeaderTitle>
        <UserInfo>
          <WelcomeText>Welcome, {user?.username}</WelcomeText>
          <Button variant="secondary" onClick={logout}>
            <LogOut size={16} />
            Logout
          </Button>
        </UserInfo>
      </Header>

      <Content>
        <FiltersCard>
          <FiltersGrid>
            <Input
              type="text"
              placeholder="Search characters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={Search}
            />
            
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="alive">Alive</option>
              <option value="dead">Dead</option>
              <option value="unknown">Unknown</option>
            </Select>

            <Input
              type="text"
              placeholder="Filter by species..."
              value={speciesFilter}
              onChange={(e) => setSpeciesFilter(e.target.value)}
            />

            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
            >
              <option value="">All Genders</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="genderless">Genderless</option>
              <option value="unknown">Unknown</option>
            </Select>
          </FiltersGrid>

          <ControlsRow>
            <SortControls>
              <SortLabel>Sort by:</SortLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name</option>
                <option value="status">Status</option>
                <option value="species">Species</option>
                <option value="gender">Gender</option>
                <option value="created">Created</option>
              </Select>
              
              <SortButton
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              >
                {sortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
              </SortButton>
            </SortControls>

            <Button
              variant={showFavoritesOnly ? 'primary' : 'secondary'}
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            >
              <Heart size={16} fill={showFavoritesOnly ? 'currentColor' : 'none'} />
              {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
            </Button>
          </ControlsRow>
        </FiltersCard>

        <CharactersGrid>
          {filteredCharacters.map(character => (
            <CharacterCard
              key={character.id}
              character={character}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </CharactersGrid>

        {filteredCharacters.length === 0 && (
          <EmptyState>
            <h3>No characters found</h3>
            <p>Try adjusting your search or filters</p>
          </EmptyState>
        )}
      </Content>
    </PageContainer>
  );
};