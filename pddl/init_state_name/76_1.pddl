(define (problem scene1)
  (:domain manip)
  (:objects
    strawberry - item
    white radish - item
    water bottle - item
    plastic knife - item
    green marker - item
  )
  (:init
    (ontable strawberry)
    (ontable white radish)
    (ontable water bottle)
    (ontable plastic knife)
    (ontable green marker)
    (clear strawberry)
    (clear white radish)
    (clear water bottle)
    (clear plastic knife)
    (clear green marker)
    (handempty)
  )
  (:goal (and ))
)