import os
import pandas as pd 
import joblib
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder ,StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.model_selection import StratifiedShuffleSplit




MODEL_FILE =  'model.pkl'
PIPELINE_FILE =  'pipeline.pkl'

def build_pipeline(categorical,numrical):
  numrical_pipeline = Pipeline([
    ('imputer',SimpleImputer(strategy='median')),
    ('scaler',StandardScaler())
  ])

  categorical_pipeline = Pipeline([
    ('oneHotEncoding',OneHotEncoder(handle_unknown='ignore'))
  ])

  fullPipeline = ColumnTransformer([
    ('Num',numrical_pipeline,numrical),
    ('Cat',categorical_pipeline,categorical)
  ])

  return fullPipeline

if not os.path.exists(MODEL_FILE):

  data = pd.read_csv('data/diabetes_prediction_dataset.csv')

  split = StratifiedShuffleSplit(n_splits = 1,test_size=0.2,random_state=42)

  for train_idx , test_idx in split.split(data,data['diabetes']):
    train_data = data.iloc[train_idx]

  test_data = data.iloc[test_idx].to_csv('data/output/input.csv',index=False)

  x_feature = train_data.drop('diabetes',axis=1)
  x_label = train_data['diabetes']

  num_attribute = x_feature.drop(['gender','smoking_history'],axis=1).columns.tolist()
  categorical_attribute = ['gender','smoking_history']

  pipeline = build_pipeline(categorical_attribute,num_attribute)
  x_feature_prepared = pipeline.fit_transform(x_feature)

  model = GradientBoostingClassifier()
  model.fit(x_feature_prepared,x_label)

  joblib.dump(model,MODEL_FILE)
  joblib.dump(pipeline,PIPELINE_FILE)

  print("✅ Model trained and saved!")


else:
  model = joblib.load(MODEL_FILE)
  pipeline = joblib.load(PIPELINE_FILE)

  input_data = pd.read_csv('data/input.csv')
  transformed_data = pipeline.transform(input_data)
  predictions = model.predict(transformed_data)

  # Create results without modifying original
  results = input_data.copy()
  results['diabetes_prediction'] = predictions  #  FIXED: Better column name
  results.to_csv('data/output/output.csv', index=False)  # FIXED: Output -> output
  
  print("✅ Predictions complete! Check output.csv")




