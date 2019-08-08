import gql from 'graphql-tag';

export const allgeneric = gql`{
  institutions{
    institution
  }
  departments{
    department
  }
  facultys{
    faculty
  }
  levels{
    level
  }
  calendartypes{
    type
    icon
    description
  }
  colors{
    color
    code
    textcolor
  }
  roles{
    role
  }
}`;
