(define (problem scene1)
  (:domain manip)
  (:objects
    green romaine lettuce - item
    purple eggplant - item
    water bottle - item
    plastic knife - item
  )
  (:init
    (ontable green romaine lettuce)
    (ontable purple eggplant)
    (ontable water bottle)
    (ontable plastic knife)
    (clear green romaine lettuce)
    (clear purple eggplant)
    (clear water bottle)
    (clear plastic knife)
    (handempty)
  )
  (:goal (and ))
)