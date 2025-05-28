(define (problem generated)
  (:domain manip)
  (:objects
    container_02 container_09 - container
    kitchen_07 kitchen_09 kitchen_11 kitchen_19 kitchen_23 - item
    lid_03 - lid
  )
  (:init
    (clear kitchen_07)
    (clear kitchen_09)
    (clear kitchen_11)
    (clear kitchen_19)
    (clear kitchen_23)
    (clear lid_03)
    (handempty)
    (in kitchen_11 container_02)
    (ontable container_02)
    (ontable container_09)
    (ontable kitchen_07)
    (ontable kitchen_09)
    (ontable kitchen_19)
    (ontable kitchen_23)
    (ontable lid_03)
  )
  (:goal (and))
)
